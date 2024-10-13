export interface IUserIPLocation {
  country: string;
  state: string;
  city: string;
  zip: string;
  timezone: string;
}

export interface IUserIPInfo {
  ip: string;
  location: IUserIPLocation;
}

export interface IDeviceInfo {
  browser: string;
  os: string;
  platform: string;
  source: string;
}
