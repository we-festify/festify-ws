import { Link, useNavigate, useParams } from 'react-router-dom';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import { BESInstanceStatus, IBESInstance } from '@sharedtypes/bes';
import { formatTimeFromNow } from '@sharedui/utils/time';
import {
  instanceStatusIcons,
  instanceStatusMapping,
} from '../../../../constants/instance';
import { RotateCw } from 'lucide-react';
import { besPaths } from '@sharedui/constants/paths';
import { cn } from '@sharedui/utils/tw';
import {
  useDeleteBESInstancesMutation,
  useGetBESInstanceByAliasQuery,
} from '../../../../api/instances';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { readableFRN } from '@sharedui/utils/frn';
import CopyIcon from '@sharedui/components/copy-icon';

const InstanceDetailsPage = () => {
  const { alias = '' } = useParams<{ alias: string }>();
  const { data: { instance } = {}, refetch } = useGetBESInstanceByAliasQuery<{
    data: { instance: IBESInstance };
  }>(alias, {
    skip: !alias,
  });
  const navigate = useNavigate();
  const [deleteInstances] = useDeleteBESInstancesMutation();

  const handleDeleteInstance = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (!instance) return;

    try {
      await deleteInstances([instance._id]).unwrap();
      navigate(besPaths.INSTANCES);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefreshInstance = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    try {
      await refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8">
      <PageSection
        title={alias}
        header={
          <div className="flex items-center justify-end gap-4">
            <Button
              size="sm"
              variant="destructive-outline"
              onClick={handleDeleteInstance}
            >
              Delete
            </Button>
            <Button
              name="Refresh instances"
              size="sm"
              variant="outline"
              onClick={handleRefreshInstance}
            >
              <RotateCw size={16} className="text-muted-foreground" />
            </Button>
            <Link
              to={besPaths.CREATE_NEW_INSTANCE}
              className={buttonVariants({
                size: 'sm',
                variant: 'secondary',
              })}
            >
              Create instance
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          {grids.map((step) => (
            <Card key={step.title}>
              <CardHeader variant="muted">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">{step.title}</h2>
                  {instance && (
                    <Link
                      to={`${besPaths.UPDATE_INSTANCE}/${instance.alias}`}
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
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {instance ? (
                  <KeyValueGrid
                    data={instance}
                    keys={step.keys}
                    colsCount={step.cols}
                  />
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
};

const grids = [
  {
    index: 0,
    title: 'Instance details',
    cols: 4,
    keys: [
      { key: 'alias', label: 'Alias' },
      {
        key: 'frn',
        label: 'Festify Resource Name (FRN)',
        formatter: (value: unknown) => (
          <span className="flex items-center">
            {readableFRN(value as string)}
            <CopyIcon value={value as string} className="h-7 p-1 ml-2" />
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        formatter: (value: unknown) => (
          <div className="flex gap-2">
            <span>{instanceStatusIcons[value as BESInstanceStatus]}</span>
            <span>{instanceStatusMapping[value as BESInstanceStatus]}</span>
          </div>
        ),
      },
      {
        key: 'createdAt',
        label: 'Created at',
        formatter: (value: unknown) =>
          formatTimeFromNow((value as Date).toString()),
      },
      {
        key: 'updatedAt',
        label: 'Updated at',
        formatter: (value: unknown) =>
          formatTimeFromNow((value as Date).toString()),
      },
    ],
  },
  {
    index: 1,
    title: 'Email credentials',
    cols: 2,
    keys: [
      { key: 'senderName', label: 'Sender name' },
      { key: 'senderEmail', label: 'Sender email address' },
      {
        key: 'senderPassword',
        label: 'Sender password',
        formatter: () => (
          <span className="text-muted-foreground text-xs">
            hidden for security reasons
          </span>
        ),
      },
    ],
  },
  {
    index: 2,
    title: 'SMTP settings',
    keys: [
      { key: 'smtpHost', label: 'SMTP host' },
      { key: 'smtpPort', label: 'SMTP port' },
    ],
  },
];

export default InstanceDetailsPage;
