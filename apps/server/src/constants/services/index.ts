import features from '@/config/features';
import { IServiceMeta } from '@sharedtypes/meta';

export const services: IServiceMeta[] = [
  {
    name: 'Basic Email Service',
    shortName: 'BES',
    alias: 'bes',
    src: '/logos/BES.png',
    description: 'A basic email service that sends and receives emails',
  },
  {
    name: 'Access and Identity Management',
    shortName: 'AIM',
    alias: 'aim',
    src: '/logos/AIM.png',
    description: 'A service that manages access and identity',
  },
  features.festifyAnalogService && {
    name: 'Festify Analog',
    shortName: 'Analog',
    alias: 'analog',
    src: '/logos/Analog.png',
    description: 'A service that provides analytics, logs and insights',
  },
].filter(Boolean) as IServiceMeta[];
