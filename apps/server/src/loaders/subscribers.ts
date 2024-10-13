import { emitter } from '../events';
import { AuthSubscriber } from '../subscribers/auth';
import { logger } from '../utils/logger';

const subscribersLoader = async () => {
  new AuthSubscriber(emitter);
  logger.info('Auth event subscribers loaded');
};

export default subscribersLoader;
