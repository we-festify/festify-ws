import { Card, CardContent } from '@sharedui/primitives/card';
import { CircleX } from 'lucide-react';
import { PropsWithChildren } from 'react';
import MarkdownContent from './markdown-content';
import { cn } from '@sharedui/utils/tw';
import { getErrorMessage, getErrorName } from '@sharedui/utils/error';

const ErrorBox = ({
  error,
  className,
}: PropsWithChildren<{
  error?: unknown;
  className?: string;
}>) => {
  if (!error) return null;

  const name = getErrorName(error);
  const message = getErrorMessage(error);

  return (
    <Card className={cn('border-destructive border-2', className)}>
      <CardContent className="p-4 -mb-4">
        <div className="flex gap-4 text-sm">
          <CircleX size={22} className="text-destructive shrink-0" />
          {typeof message === 'string' ? (
            <div className="text-start space-y-2">
              {name && <h2 className="text-base font-semibold">{name}</h2>}
              <MarkdownContent source={message} />
            </div>
          ) : (
            message
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorBox;
