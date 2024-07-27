import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';

export const instanceStatusMapping = {
  active: <span className="text-green-600">Active</span>,
  unverified: <span className="text-yellow-600">Unverified</span>,
  inactive: <span className="text-red-600">Inactive</span>,
};

export const instanceStatusIcons = {
  active: <CircleCheck className="fill-green-600 text-white size-5" />,
  unverified: <CircleAlert className="fill-yellow-600 text-white size-5" />,
  inactive: <CircleX className="fill-red-600 text-white size-5" />,
};
