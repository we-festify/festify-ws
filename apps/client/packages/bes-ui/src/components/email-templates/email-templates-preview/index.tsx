import { IBESEmailTemplate } from '@sharedtypes/bes';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { useState } from 'react';
import { Button } from '@sharedui/primitives/button';
import { Monitor, Smartphone } from 'lucide-react';
import { cn } from '@sharedui/utils/tw';
import ErrorBox from '@sharedui/components/error-box';

interface EmailTemplatePreviewProps {
  template?: IBESEmailTemplate;
  error?: unknown;
}

type Platform = 'web' | 'mobile';

const EmailTemplatePreview = ({
  template,
  error,
}: EmailTemplatePreviewProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('web');

  return (
    <Card>
      <CardHeader
        variant="muted"
        className="flex flex-row items-center justify-between gap-4"
      >
        <h3 className="text-lg font-semibold">Email template preview</h3>
        <div className="flex gap-4 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedPlatform('web')}
            className={selectedPlatform === 'web' ? 'ring-1 ring-primary' : ''}
          >
            <Monitor size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedPlatform('mobile')}
            className={
              selectedPlatform === 'mobile' ? 'ring-1 ring-primary' : ''
            }
          >
            <Smartphone size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <ErrorBox error={error} />
        {template && (
          <>
            <div className="w-full flex gap-4 justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Subject:{' '}
                <span className="text-primary">{template?.subject}</span>
              </h3>
            </div>
            <div
              className={cn(
                'bg-border rounded-3xl p-5',
                selectedPlatform === 'web'
                  ? 'w-full aspect-video max-w-[728px]'
                  : 'w-80 aspect-[9/16]',
              )}
            >
              <div className="rounded-xl overflow-hidden bg-background w-full h-full relative">
                <iframe
                  title="Email template preview"
                  srcDoc={getPreviewTemplate(template)}
                  className="w-full h-full bg-white pt-2"
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-border rounded-br-md rounded-bl-md z-10" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              This is a preview of how the email will look like when sent to the
              user. The actual email may look different depending on the email
              client used by the recipient.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const getPreviewTemplate = (template: IBESEmailTemplate) => {
  const variablesRegex = /\{\{([a-zA-Z_]+)\}\}/g;

  return `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 14px;
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
        }
        span {
            color: #0070f3;
        }
    </style>
</head>
<body>
    <pre>${template.body.replace(
      variablesRegex,
      (_: unknown, variable: string) => `<span>{{${variable}}}</span>`,
    )}</pre>
</body>
</html>`;
};

export default EmailTemplatePreview;
