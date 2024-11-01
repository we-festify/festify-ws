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
    name: 'Telegram Service',
    shortName: 'TS',
    alias: 'ts',
    src: '/logos/TS.png',
    description: 'A service that controls telegram bots',
  },
  {
    name: 'Access and Identity Management',
    shortName: 'AIM',
    alias: 'aim',
    src: '/logos/AIM.png',
    description: 'A service that manages access and identity',
  },
  {
    name: 'Secure Key Vault',
    shortName: 'SKV',
    alias: 'skv',
    src: '/logos/SKV.png',
    description: 'A service that stores secure keys',
  },
  {
    name: 'Simple Secret Keeper',
    shortName: 'SSK',
    alias: 'ssk',
    src: '/logos/SSK.png',
    description: 'A service that stores secrets securely',
  },
  {
    name: 'Basic Authentication Service',
    shortName: 'BAS',
    alias: 'bas',
    src: '/logos/BAS.png',
    description: 'A basic authentication service',
  },
] as const;
