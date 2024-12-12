export type FwsConfig = {
  apiUrl: string;
  accessKeyId: string;
  accessKeySecret: string;
};

export interface FwsClient {
  readConfig(): FwsConfig;
}
