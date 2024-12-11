import { BESInstanceStatus } from '@sharedtypes/bes';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';

export const instanceStatusMapping: Record<BESInstanceStatus, JSX.Element> = {
  active: <span className="text-green-600">Active</span>,
  unverified: <span className="text-yellow-600">Unverified</span>,
  suspended: <span className="text-red-600">Suspended</span>,
};

export const instanceStatusIcons: Record<BESInstanceStatus, JSX.Element> = {
  active: <CircleCheck className="fill-green-600 text-background size-5" />,
  unverified: (
    <CircleAlert className="fill-yellow-600 text-background size-5" />
  ),
  suspended: <CircleX className="fill-red-600 text-background size-5" />,
};
