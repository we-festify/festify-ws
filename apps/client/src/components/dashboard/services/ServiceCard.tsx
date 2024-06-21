import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import { BotMessageSquare, Flame, MailCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: {
    type: string;
    name: string;
    fullName: string;
    summary: string;
  };
}

interface Icons {
  [key: string]: React.ElementType;
}

const icons: Icons = {
  bes: MailCheck,
  ts: BotMessageSquare,
  default: Flame,
};

export default function Component({ service }: ServiceCardProps) {
  return (
    <Link to={`${service.type}`}>
      <Card className="hover:shadow-md cursor-pointer">
        <CardHeader className="flex flex-col space-y-0 pb-2 gap-6">
          {icons[service.type]
            ? React.createElement(icons[service.type])
            : React.createElement(icons.default)}
          <CardTitle className="text-sm font-medium">
            {service.fullName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{service.name}</div>
          <p className="text-xs text-muted-foreground">{service.summary}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
