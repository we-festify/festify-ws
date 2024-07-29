import { Link, useNavigate, useParams } from 'react-router-dom';
import PageSection from '../../../../../shared/components/PageSection';
import { Card, CardContent, CardHeader } from '../../../../../shared/ui/card';
import { Button, buttonVariants } from '../../../../../shared/ui/button';
import KeyValueGrid from '../../../../../shared/components/ui/KeyValueGrid';
import { BESInstanceStatusType, BESInstanceType } from '@shared/types/bes';
import { formatTimeFromNow } from '@shared/utils/time';
import {
  instanceStatusIcons,
  instanceStatusMapping,
} from '../../../../constants/instance';
import { RotateCw } from 'lucide-react';
import { besPaths } from '../../../../constants/paths';
import { cn } from '../../../../../../lib/utils';
import {
  useDeleteBESInstancesMutation,
  useGetBESInstanceByAliasQuery,
} from '../../../../api/instances';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../../../shared/utils/error';

const InstanceDetailsPage = () => {
  const { alias = '' } = useParams<{ alias: string }>();
  const { data: { instance } = {}, refetch } = useGetBESInstanceByAliasQuery<{
    data: { instance: BESInstanceType };
  }>(alias, {
    skip: !alias,
  });
  const navigate = useNavigate();
  const [deleteInstances] = useDeleteBESInstancesMutation();

  const handleDeleteInstance = async (
    e: React.MouseEvent<HTMLButtonElement>
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
    e: React.MouseEvent<HTMLButtonElement>
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
                        'w-20'
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
        key: 'status',
        label: 'Status',
        formatter: (value: string) => (
          <div className="flex gap-2">
            <span>{instanceStatusIcons[value as BESInstanceStatusType]}</span>
            <span>{instanceStatusMapping[value as BESInstanceStatusType]}</span>
          </div>
        ),
      },
      {
        key: 'createdAt',
        label: 'Created at',
        formatter: (value: Date) => formatTimeFromNow(value.toString()),
      },
      {
        key: 'updatedAt',
        label: 'Updated at',
        formatter: (value: Date) => formatTimeFromNow(value.toString()),
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
        formatter: (value: string) => (
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
