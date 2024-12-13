import {
  useCreateAccessKeyMutation,
  useDeleteAccessKeyMutation,
  useReadAccessKeyQuery,
  useRotateAccessKeyMutation,
} from '@aim-ui/api/access-key';
import {
  useDeleteManagedUsersMutation,
  useReadManagedUserQuery,
} from '@aim-ui/api/users';
import { useAuth } from '@rootui/providers/auth-provider';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import CopyIcon from '@sharedui/components/copy-icon';
import DeleteButton from '@sharedui/components/delete-button';
import ErrorBox from '@sharedui/components/error-box';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import PageSection from '@sharedui/components/page-section';
import { aimPaths } from '@sharedui/constants/paths';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@sharedui/primitives/alert-dialog';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { getErrorMessage } from '@sharedui/utils/error';
import { generateFRN, readableFRN } from '@sharedui/utils/frn';
import { formatDateTime, formatTimeAgoFromNow } from '@sharedui/utils/time';
import { cn } from '@sharedui/utils/tw';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const ManagedUserDetailsPage = () => {
  const { alias } = useParams<{ alias: string }>();
  const { user } = useAuth();
  const frn = generateFRN('aim', user?.accountId ?? '', 'user', alias ?? '');
  const {
    data: { user: managedUser } = {},
    refetch,
    error: readManagedUserError,
  } = useReadManagedUserQuery(frn);
  const navigate = useNavigate();
  const [deleteManagedUsers] = useDeleteManagedUsersMutation();

  const handleDeleteUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!managedUser) return;

    try {
      await deleteManagedUsers([frn]).unwrap();
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

  return (
    <div className="p-8">
      <PageSection
        title={managedUser?.alias}
        description={
          managedUser
            ? `Created ${formatTimeAgoFromNow(managedUser.createdAt.toString())}`
            : ''
        }
        header={
          <div className="flex items-center justify-end gap-4">
            <DeleteButton
              size="sm"
              variant="destructive-outline"
              onClick={handleDeleteUser}
              description="This action cannot be undone. This will permanently delete the user."
            >
              Delete
            </DeleteButton>
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
                  {managedUser && (
                    <Link
                      to={`${aimPaths.UPDATE_USER}/${managedUser.alias}`}
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
                <ErrorBox error={readManagedUserError}>
                  {managedUser ? (
                    <KeyValueGrid
                      data={managedUser}
                      keys={step.keys}
                      colsCount={step.cols}
                    />
                  ) : null}
                </ErrorBox>
              </CardContent>
            </Card>
          ))}
          <AccessKeyDetails userFrn={frn} />
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
        formatter: (_: unknown, row: unknown) => {
          const { alias } = row as IManagedUser;
          const value = generateFRN('aim', '', 'user', alias);
          return (
            <div className="flex items-center gap-2">
              <span>{readableFRN(value as string)}</span>
              <CopyIcon value={value as string} />
            </div>
          );
        },
      },
      {
        key: 'createdAt',
        label: 'Created at',
        formatter: (value: unknown) =>
          formatTimeAgoFromNow((value as Date).toString()),
      },
      {
        key: 'updatedAt',
        label: 'Updated at',
        formatter: (value: unknown) =>
          formatTimeAgoFromNow((value as Date).toString()),
      },
    ],
  },
];

const AccessKeyDetails = ({ userFrn }: { userFrn: string }) => {
  const {
    data: { accessKey } = {},
    error: readAccessKeyError,
    refetch,
  } = useReadAccessKeyQuery(userFrn);
  const [rotateAccessKey] = useRotateAccessKeyMutation();
  const [createAccessKey] = useCreateAccessKeyMutation();
  const [deleteAccessKey] = useDeleteAccessKeyMutation();
  // this is the key secret to be displayed
  // only when access key is created/rotated
  const [secret, setSecret] = useState<string | null>(null);

  const handleCreateAccessKey = async () => {
    try {
      const { secret } = await createAccessKey(userFrn).unwrap();
      setSecret(secret);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRotateAccessKey = async () => {
    try {
      const { secret } = await rotateAccessKey(userFrn).unwrap();
      setSecret(secret);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteAccessKey = async () => {
    try {
      await deleteAccessKey(userFrn).unwrap();
      toast.success('Access key deleted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <Card>
        <CardHeader variant="muted">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Access key details</h2>
            <div className="flex items-center gap-4">
              {!readAccessKeyError ? (
                <>
                  <Button size="sm" variant="outline" onClick={refetch}>
                    <RotateCw size={16} className="text-muted-foreground" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRotateAccessKey}
                  >
                    Rotate
                  </Button>
                  <DeleteButton
                    size="sm"
                    variant="destructive-outline"
                    onClick={handleDeleteAccessKey}
                    description="This action cannot be undone. This will permanently delete the access key."
                  >
                    Delete
                  </DeleteButton>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCreateAccessKey}
                  >
                    Create access key
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ErrorBox error={readAccessKeyError}>
            {accessKey ? (
              <KeyValueGrid
                data={accessKey}
                keys={[
                  { key: '_id', label: 'Access key ID' },
                  {
                    key: 'expiresAt',
                    label: 'Expires at',
                    formatter: (value: unknown) => {
                      return value
                        ? formatDateTime((value as Date).toString())
                        : '';
                    },
                  },
                  {
                    key: 'lastUsedAt',
                    label: 'Last used at',
                    formatter: (value: unknown) => {
                      return value
                        ? formatDateTime((value as Date).toString())
                        : 'Never';
                    },
                  },
                  {
                    key: 'updatedAt',
                    label: 'Last updated at',
                    formatter: (value: unknown) => {
                      return value
                        ? formatDateTime((value as Date).toString())
                        : '';
                    },
                  },
                ]}
                colsCount={4}
              />
            ) : null}
          </ErrorBox>
        </CardContent>
      </Card>
      <AlertDialog open={!!secret}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Access key secret generated successfully
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col gap-4">
                <p>
                  Please copy the secret below and store it securely. You will
                  not be able to see this secret again. However, you can rotate
                  the access key to generate a new secret at any time.
                </p>
                <div className="flex items-center gap-2">
                  <span className="break-all">{secret}</span>
                  <CopyIcon value={secret ?? ''} />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSecret(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setSecret(null)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManagedUserDetailsPage;
