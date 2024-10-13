import { Link } from 'react-router-dom';
import KeyValueGrid, {
  KeyValueType,
} from '@sharedui/components/key-value-grid';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import { buttonVariants } from '@sharedui/primitives/button';
import { cn } from '@sharedui/utils/tw';
import { formatTimeFromNow } from '@sharedui/utils/time';
import { besPaths } from '@sharedui/constants/paths';
import { readableFRN } from '@sharedui/utils/frn';
import CopyIcon from '@sharedui/components/copy-icon';

interface EmailTemplatesummaryProps {
  template: IBESEmailTemplate;
}

const EmailTemplateSummary = ({ template }: EmailTemplatesummaryProps) => {
  return (
    <Card>
      <CardHeader
        variant="muted"
        className="flex flex-row items-center justify-between gap-4"
      >
        <h3 className="text-lg font-semibold">Email template summary</h3>
        <div className="flex gap-4">
          <Link
            to={`${besPaths.UPDATE_EMAIL_TEMPLATE}/${template._id}`}
            className={cn(
              buttonVariants({
                size: 'sm',
                variant: 'outline',
              }),
              'w-20',
            )}
          >
            Edit
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <KeyValueGrid
          keys={
            [
              {
                key: 'frn',
                label: 'Festify Resource Name (FRN)',
                formatter: (value: unknown) => (
                  <span>
                    {readableFRN(value as string)}
                    <CopyIcon
                      value={value as string}
                      className="h-7 p-1 ml-2"
                    />
                  </span>
                ),
              },
              { key: 'name', label: 'Name' },
              { key: 'subject', label: 'Subject' },
              {
                key: 'createdAt',
                label: 'Created at',
                formatter: formatTimeFromNow,
              },
              {
                key: 'updatedAt',
                label: 'Updated at',
                formatter: formatTimeFromNow,
              },
            ] as KeyValueType[]
          }
          data={template}
        />
      </CardContent>
    </Card>
  );
};

export default EmailTemplateSummary;
