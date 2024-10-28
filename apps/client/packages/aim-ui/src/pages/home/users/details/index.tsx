import {
  useDeleteManagedUsersMutation,
  useGetManagedUserByIdQuery,
} from '@aim-ui/api/users';
import CopyIcon from '@sharedui/components/copy-icon';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import PageSection from '@sharedui/components/page-section';
import { aimPaths } from '@sharedui/constants/paths';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { getErrorMessage } from '@sharedui/utils/error';
import { readableFRN } from '@sharedui/utils/frn';
import { formatTimeFromNow } from '@sharedui/utils/time';
import { cn } from '@sharedui/utils/tw';
import { RotateCw } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const ManagedUserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: { user } = {}, refetch } = useGetManagedUserByIdQuery(
    userId as string,
  );
  const navigate = useNavigate();
  const [deleteManagedUsers] = useDeleteManagedUsersMutation();

  const handleDeleteUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) return;

    try {
      await deleteManagedUsers([user._id]).unwrap();
      toast.success('User deleted successfully');
      navigate(aimPaths.USERS);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefreshUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!user) return null;

  return (
    <div className="p-8">
      <PageSection
        title={user.alias}
        description={`Created ${formatTimeFromNow(user.createdAt.toString())}`}
        header={
          <div className="flex items-center justify-end gap-4">
            <Button
              size="sm"
              variant="destructive-outline"
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
            <Button
              name="Refresh instances"
              size="sm"
              variant="outline"
              onClick={handleRefreshUser}
            >
              <RotateCw size={16} className="text-muted-foreground" />
            </Button>
            <Link
              to={aimPaths.CREATE_NEW_USER}
              className={buttonVariants({
                size: 'sm',
                variant: 'secondary',
              })}
            >
              Create new user
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
                  {user && (
                    <Link
                      to={`${aimPaths.UPDATE_USER}/${user._id}`}
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
                {user ? (
                  <KeyValueGrid
                    data={user}
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
    title: 'User details',
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
];

export default ManagedUserDetailsPage;
