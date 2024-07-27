import { paths } from './paths';

export const services: ServiceMetaType[] = [
  {
    name: 'Basic Email Service',
    shortName: 'BES',
    src: '/logos/BES.png',
    description: 'A basic email service that sends and receives emails',
    docsPath: paths.bes.DOCS,
    homePath: paths.bes.HOME,
  },
  {
    name: 'Telegram Service',
    shortName: 'TS',
    src: '/logos/TS.png',
    description: 'A service that controls telegram bots',
  },
  {
    name: 'Access and Identity Management',
    shortName: 'AIM',
    src: '/logos/AIM.png',
    description: 'A service that manages access and identity',
  },
  {
    name: 'Secure Key Vault',
    shortName: 'SKV',
    src: '/logos/SKV.png',
    description: 'A service that stores secure keys',
  },
  {
    name: 'Simple Secret Keeper',
    shortName: 'SSK',
    src: '/logos/SSK.png',
    description: 'A service that stores secrets securely',
  },
  {
    name: 'Basic Authentication Service',
    shortName: 'BAS',
    src: '/logos/BAS.png',
    description: 'A basic authentication service',
  },
] as const;

export interface ServiceMetaType {
  name: string;
  shortName: string;
  src: string;
  description: string;
  docsPath?: string;
  homePath?: string;
}
