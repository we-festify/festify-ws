import { FwsClient, FwsConfig } from './types/client';
import { FwsError } from './utils/errors';

export class Fws implements FwsClient {
  private readonly config: FwsConfig;

  constructor(config: FwsConfig) {
    this.config = config;

    if (
      !this.config.apiUrl ||
      !this.config.accessKeyId ||
      !this.config.accessKeySecret
    ) {
      throw new FwsError('Invalid configuration');
    }
  }

  public readConfig(): FwsConfig {
    return this.config;
  }
}
