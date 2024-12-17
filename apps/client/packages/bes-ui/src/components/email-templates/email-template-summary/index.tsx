import { Link } from 'react-router-dom';
import KeyValueGrid, {
  KeyValueType,
} from '@sharedui/components/key-value-grid';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import { buttonVariants } from '@sharedui/primitives/button';
import { cn } from '@sharedui/utils/tw';
import { formatTimeAgoFromNow } from '@sharedui/utils/time';
import { besPaths } from '@sharedui/constants/paths';
import { generateFRN, readableFRN } from '@sharedui/utils/frn';
import CopyIcon from '@sharedui/components/copy-icon';
import ErrorBox from '@sharedui/components/error-box';

interface EmailTemplatesummaryProps {
  template?: IBESEmailTemplate;
  error?: unknown;
}

const EmailTemplateSummary = ({
  template,
  error,
}: EmailTemplatesummaryProps) => {
  return (
    <Card>
      <CardHeader
        variant="muted"
        className="flex flex-row items-center justify-between gap-4"
      >
        <h3 className="text-lg font-semibold">Email template summary</h3>
        <div className="flex gap-4">
          <Link
            to={`${besPaths.UPDATE_EMAIL_TEMPLATE}/${template?._id}`}
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
        <ErrorBox error={error} />
        {template && (
          <KeyValueGrid
            keys={
              [
                {
                  key: 'frn',
                  label: 'Festify Resource Name (FRN)',
                  formatter: (_: unknown, row: unknown) => {
                    const { _id } = row as IBESEmailTemplate;
                    const value = generateFRN('bes', '', 'template', _id);
                    return (
                      <div className="flex items-center gap-2">
                        <span>{readableFRN(value as string)}</span>
                        <CopyIcon value={value as string} />
                      </div>
                    );
                  },
                },
                { key: 'name', label: 'Name' },
                { key: 'subject', label: 'Subject' },
                {
                  key: 'createdAt',
                  label: 'Created at',
                  formatter: formatTimeAgoFromNow,
                },
                {
                  key: 'updatedAt',
                  label: 'Updated at',
                  formatter: formatTimeAgoFromNow,
                },
              ] as KeyValueType[]
            }
            data={template}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EmailTemplateSummary;
