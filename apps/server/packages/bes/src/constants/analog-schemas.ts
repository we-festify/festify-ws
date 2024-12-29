import { AnalogSchema } from '@sharedtypes/analog';

export const schemas: AnalogSchema[] = [
  {
    name: 'BESEmailDeliveryStats',
    fields: [
      { key: 'instance', type: 'ref', ref: 'BESInstance' },
      { key: 'sent', type: 'number' },
      { key: 'delivered', type: 'number' },
      { key: 'errored', type: 'number' },
      { key: 'hour', type: 'datetime' },
    ],
  },
];
