import { AppError, CommonErrors } from '@/utils/errors';
import {
  BridgeEndpointIntegration,
  IBridgeApi,
  IBridgeApiEndpoint,
  IBridgeHttpIntegration,
  IBridgeMockIntegration,
} from '@sharedtypes/bridge';
import { Model } from 'mongoose';
import { LRUCache } from 'lru-cache';
import { v4 as uuidv4 } from 'uuid';
import fetch, { RequestInit } from 'node-fetch';
import http from 'http';
import https from 'https';

const apiCache = new LRUCache<
  string, // 'uid'
  IBridgeApi
>({
  max: 100, // Increased cache size
  ttl: 1000 * 60 * 5, // 15 minutes
});
const endpointCache = new LRUCache<
  string, // 'uid-path-method'
  { api: IBridgeApi; endpoint: IBridgeApiEndpoint }
>({
  max: 500, // Increased cache size
  ttl: 1000 * 60 * 5, // 5 minutes
});

interface IInvokeOptions {
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ILogEntry {
  timestamp: number;
  message: string;
}

// Pre-allocate log arrays to reduce memory pressure
const MAX_LOGS_PER_REQUEST = 20;
class RequestLogger {
  private logs: ILogEntry[] = new Array(MAX_LOGS_PER_REQUEST);
  private count: number = 0;

  log(message: string): void {
    if (this.count < MAX_LOGS_PER_REQUEST) {
      this.logs[this.count] = { timestamp: Date.now(), message };
      this.count++;
    }
  }

  getLogs(): ILogEntry[] {
    return this.logs.slice(0, this.count);
  }
}

// Create an HTTP client with connection pooling
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

export class EndpointInvokeService {
  private readonly apiModel: Model<IBridgeApi>;
  private readonly endpointModel: Model<IBridgeApiEndpoint>;

  constructor(
    apiModel: Model<IBridgeApi>,
    endpointModel: Model<IBridgeApiEndpoint>,
  ) {
    this.apiModel = apiModel;
    this.endpointModel = endpointModel;
  }

  public async invoke(
    apiUid: string,
    { path, method, headers = {}, body }: IInvokeOptions,
  ): Promise<{
    statusCode: number;
    body: unknown;
    headers: Record<string, string>;
    logs: ILogEntry[];
  }> {
    const uid = uuidv4();
    const REQUEST_ID = `${apiUid}-${uid}`;
    const logger = new RequestLogger();

    logger.log(`Starting execution for request: ${REQUEST_ID}`);
    logger.log(`HTTP Method: ${method}`);
    logger.log(`Path: ${path}`);

    try {
      // Get endpoint info (either from cache or DB)
      const { endpoint } = await this.getEndpointInfo(
        apiUid,
        path,
        method,
        logger,
      );

      // Process the request through appropriate integration
      const response = await this.handleIntegration(
        logger,
        endpoint.integration,
        { headers, body },
      );

      logger.log('Response headers: ' + JSON.stringify(response.headers));
      logger.log(`Response body sample: ${this.getSampleBody(response.body)}`);
      logger.log(`Execution completed with status: ${response.statusCode}`);

      return {
        ...response,
        logs: logger.getLogs(),
      };
    } catch (error) {
      logger.log(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // Helper to get a sample of the response body for logging
  private getSampleBody(body: unknown): string {
    if (typeof body === 'string') {
      return body.length > 100 ? body.substring(0, 100) + '...' : body;
    }
    try {
      const stringified = JSON.stringify(body);
      return stringified.length > 100
        ? stringified.substring(0, 100) + '...'
        : stringified;
    } catch {
      return '[Complex body]';
    }
  }

  // Separated endpoint lookup logic for better organization
  private async getEndpointInfo(
    apiUid: string,
    path: string,
    method: string,
    logger: RequestLogger,
  ): Promise<{ api: IBridgeApi; endpoint: IBridgeApiEndpoint }> {
    const endpointCacheKey = `${apiUid}-${path}-${method}`;
    const cachedEndpoint = endpointCache.get(endpointCacheKey);

    if (cachedEndpoint) {
      logger.log('Using cached endpoint information');
      return cachedEndpoint;
    }

    logger.log('Fetching endpoint information from database');

    const cachedApi = apiCache.get(apiUid);
    let api: IBridgeApi;

    if (cachedApi) {
      api = cachedApi;
    } else {
      api = (await this.apiModel.findOne({ uid: apiUid })) as IBridgeApi;
      if (!api) {
        throw new AppError(
          CommonErrors.NotFound.name,
          CommonErrors.NotFound.statusCode,
          'API not found',
        );
      }
      apiCache.set(apiUid, api);
    }

    const endpoint = await this.endpointModel.findOne({
      api: api._id,
      path,
      method,
    });
    if (!endpoint) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Endpoint not found',
      );
    }

    const result = { api, endpoint };
    endpointCache.set(endpointCacheKey, result);
    return result;
  }

  private async handleIntegration(
    logger: RequestLogger,
    integration: BridgeEndpointIntegration,
    options: { headers?: Record<string, string>; body?: unknown },
  ) {
    switch (integration.type) {
      case 'http':
        return this.handleHttpIntegration(logger, integration, options);
      case 'mock':
        return this.handleMockIntegration(logger, integration);
      default:
        throw new AppError(
          CommonErrors.InternalServerError.name,
          CommonErrors.InternalServerError.statusCode,
          'Unsupported integration type',
        );
    }
  }

  private async handleHttpIntegration(
    logger: RequestLogger,
    integration: IBridgeHttpIntegration,
    options: { headers?: Record<string, string>; body?: unknown },
  ) {
    logger.log('Handling HTTP integration request');
    const { method, url } = integration;
    const { headers = {}, body } = options;

    const fetchOptions: RequestInit = {
      method,
      agent: url.startsWith('https') ? httpsAgent : httpAgent,
      headers: {
        ...headers,
        'User-Agent': 'FwsBridgeService/1.0',
      },
      ...(method === 'GET' || method === 'HEAD' ? {} : { body: `${body}` }),
    };

    const startTime = Date.now();
    const response = await fetch(url, fetchOptions);
    logger.log(`HTTP request completed in ${Date.now() - startTime}ms`);

    if (!response.ok) {
      logger.log('HTTP integration failed with status: ' + response.status);
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'API integration failed',
      );
    }

    const responseData = await response.text();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      statusCode: response.status,
      body: responseData,
      headers: responseHeaders,
    };
  }

  private async handleMockIntegration(
    logger: RequestLogger,
    integration: IBridgeMockIntegration,
  ) {
    logger.log('Handling mock integration request');
    const { statusCode, headers, body } = integration;

    return {
      statusCode,
      body,
      headers: headers || {},
    };
  }
}
