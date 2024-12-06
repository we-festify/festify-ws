import { Card, CardContent } from '@sharedui/primitives/card';
import { CircleX } from 'lucide-react';
import { PropsWithChildren } from 'react';
import MarkdownContent from './markdown-content';

const ErrorBoundary = ({
  children,
  error,
  show = true,
}: PropsWithChildren<{
  error: string | undefined | React.ReactNode;
  show: boolean;
}>) => {
  if (error && show) {
    return (
      <Card className="border-destructive border-2">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <CircleX size={26} className="text-destructive shrink-0" />
            {typeof error === 'string' ? (
              <div>
                <MarkdownContent source={error} />
              </div>
            ) : (
              error
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
