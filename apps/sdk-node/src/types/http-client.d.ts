export type HttpClientConfig = {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retry?: number;
};

export interface IHttpClient {
  /**
   * Create a new request.
   * @returns The request object.
   */
  createRequest(): Request;

  /**
   * Send a request to the server and return the response.
   *
   * The response data will be passed to the callback function if it is provided. A promise will be returned if the callback function is not provided.
   *
   * @param cb The callback function.
   * @returns The response data.
   */
  request<T>(): Promise<T>;
}
