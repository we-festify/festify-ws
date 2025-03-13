import {
  useDeleteApiEndpointsMutation,
  useReadApiEndpointQuery,
  useReadApiQuery,
} from '@bridge-ui/api/apis';
import { useAuth } from '@rootui/providers/auth-provider';
import CopyIcon from '@sharedui/components/copy-icon';
import DeleteButton from '@sharedui/components/delete-button';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import PageSection from '@sharedui/components/page-section';
import { bridgePaths } from '@sharedui/constants/paths';
import useSearchParam from '@sharedui/hooks/useSearchParam';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { getErrorMessage } from '@sharedui/utils/error';
import { generateFRN, readableFRN } from '@sharedui/utils/frn';
import { cn } from '@sharedui/utils/tw';
import { RotateCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const ApiEndpointDetails = () => {
  const { apiId } = useParams();
  const endpointId = useSearchParam('endpoint');
  const { user } = useAuth();
  const apiFrn = generateFRN('bridge', user?.accountId, 'api', apiId);
  const endpointFrn = generateFRN(
    'bridge',
    user?.accountId,
    'endpoint',
    endpointId,
  );
  const { data: { endpoint } = {}, refetch } = useReadApiEndpointQuery(
    { apiFrn, endpointFrn },
    { skip: !apiId || !endpointId },
  );
  const { data: { api } = {} } = useReadApiQuery(apiFrn);
  const [deleteApiEndpoints, { isLoading }] = useDeleteApiEndpointsMutation();

  const handleDeleteEndpoint = async () => {
    try {
      await deleteApiEndpoints({
        apiFrn,
        endpointFrns: [endpointFrn],
      }).unwrap();
      toast.success('Endpoint deleted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8">
      <PageSection
        title={`${apiId} - ${endpoint?.method} ${endpoint?.path}`}
        header={
          <div className="flex items-center justify-end gap-4">
            <DeleteButton
              size="sm"
              variant="destructive-outline"
              disabled={isLoading}
              onClick={handleDeleteEndpoint}
              description="This action cannot be undone. This will permanently delete the endpoint."
            >
              Delete
            </DeleteButton>
            <Button
              name="Refresh instances"
              size="sm"
              variant="outline"
              onClick={refetch}
            >
              <RotateCw size={16} className="text-muted-foreground" />
            </Button>
            <Link
              to={bridgePaths.CREATE_NEW_API_ENDPOINT(apiId ?? '')}
              className={buttonVariants({
                size: 'sm',
                variant: 'secondary',
              })}
            >
              Create new endpoint
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader variant="muted">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Endpoint details</h2>
                {endpoint && (
                  <Link
                    to={bridgePaths.UPDATE_API_ENDPOINT(
                      apiId ?? '',
                      endpointId ?? '',
                    )}
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
              <KeyValueGrid
                data={endpoint ?? {}}
                colsCount={3}
                keys={[
                  { label: 'Path', key: 'path' },
                  { label: 'Method', key: 'method' },
                  {
                    label: 'Invoke URL',
                    key: 'path',
                    formatter: (value: unknown) => {
                      const url = `${api?.invokeUrl}${value}`;
                      return (
                        <div className="flex items-center gap-2">
                          <span>{url}</span>
                          <CopyIcon value={url} />
                        </div>
                      );
                    },
                  },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader variant="muted">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Integration details</h2>
                {endpoint && (
                  <Link
                    to={bridgePaths.UPDATE_API_ENDPOINT(
                      apiId ?? '',
                      endpointId ?? '',
                    )}
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
              <KeyValueGrid
                data={endpoint?.integration ?? {}}
                colsCount={3}
                keys={[
                  { label: 'Integration type', key: 'type' },
                  ...(endpoint?.integration?.type === 'http'
                    ? [
                        { label: 'HTTP method', key: 'method' },
                        { label: 'URL', key: 'url' },
                      ]
                    : []),
                  ...(endpoint?.integration?.type === 'method'
                    ? [{ label: 'Method', key: 'frn', formatter: readableFRN }]
                    : []),
                  ...(endpoint?.integration?.type === 'mock'
                    ? [
                        { label: 'Status code', key: 'statusCode' },
                        { label: 'Body', key: 'body' },
                        {
                          label: 'Headers',
                          key: 'headers',
                          formatter: JSON.stringify,
                        },
                      ]
                    : []),
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </div>
  );
};
