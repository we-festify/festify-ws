import { Link } from 'react-router-dom';
import KeyValueGrid from '../../../../shared/components/ui/KeyValueGrid';
import { Card, CardContent, CardHeader } from '../../../../shared/ui/card';
import { BESEmailTemplateType } from '@shared/types/bes';
import { buttonVariants } from '../../../../shared/ui/button';
import { cn } from '../../../../../lib/utils';
import { formatTimeFromNow } from '@shared/utils/time';
import { besPaths } from '../../../constants/paths';

interface EmailTemplatesummaryProps {
  template: BESEmailTemplateType;
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
              'w-20'
            )}
          >
            Edit
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <KeyValueGrid
          keys={[
            { key: '_id', label: 'Template Id' },
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
          ]}
          data={template}
        />
      </CardContent>
    </Card>
  );
};

export default EmailTemplateSummary;
