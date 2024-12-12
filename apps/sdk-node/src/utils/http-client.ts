import { FwsClient } from '@/types/client';
import { hmac } from './crypto';
import { FwsError } from './errors';
import { HttpClientConfig, IHttpClient } from '@/types/http-client';

export class HttpClient implements IHttpClient {
  private readonly config: HttpClientConfig;
  private readonly fws: FwsClient;

  constructor(fws: FwsClient, config: HttpClientConfig) {
    this.config = config;
    this.fws = fws;
  }

  public createRequest(): Request {
    const { apiUrl } = this.fws.readConfig();
    const url = `${apiUrl}/${this.config.endpoint}`;

    const req = new Request(url, {
      method: this.config.method || 'GET',
      headers: this.config.headers,
      body: this.config.body ? JSON.stringify(this.config.body) : undefined,
    });

    const validityDuration = 1000 * 60 * 5; // 5 minutes
    const timestamp = Math.floor(new Date().getTime() / validityDuration);
    // remove undefined values from body
    const parsedBody = this.config.body
      ? JSON.parse(JSON.stringify(this.config.body))
      : undefined;
    const payload = {
      method: req.method,
      body: parsedBody,
      path: new URL(url).pathname,
      timestamp,
    };

    const { accessKeyId, accessKeySecret } = this.fws.readConfig();
    // Sign the request
    const signature = hmac(accessKeySecret, JSON.stringify(payload));
    req.headers.set('x-fws-ak', accessKeyId);
    req.headers.set('x-fws-sig', signature);
    req.headers.set('x-fws-timestamp', timestamp.toString());

    return req;
  }

  public async request<T>(): Promise<T> {
    const req = this.createRequest();
    const res = await fetch(req);

    if (!res.ok) {
      const err = await res.json();
      throw new FwsError(
        `${err.error.status} ${err.error.name}: ${err.error.message}`,
      );
    }

    return await res.json();
  }
}
