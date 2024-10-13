import { IDeviceInfo, IUserIPInfo } from '../../middlewares/user-agent';
import { TokenPayload } from '../../services/auth';

declare global {
  namespace Express {
    interface Request {
      deviceInfo: IDeviceInfo;
      ipInfo?: IUserIPInfo;

      user: TokenPayload;
    }
  }
}
