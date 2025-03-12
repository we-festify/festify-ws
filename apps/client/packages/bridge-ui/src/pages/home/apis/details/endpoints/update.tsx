import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { bridgePaths } from '@sharedui/constants/paths';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useReadApiEndpointQuery,
  useUpdateApiEndpointMutation,
} from '@bridge-ui/api/apis';
import { BridgeApiEndpointMethod } from '@sharedtypes/bridge';
import { useAuth } from '@rootui/providers/auth-provider';
import { generateFRN } from '@sharedui/utils/frn';
import MultiStepForm, {
  MultiStepFormStep,
} from '@sharedui/components/multi-step-form';
import { EndpointDetails } from '@bridge-ui/components/api-endpoint-form-steps/endpoint-details';
import {
  schema,
  SchemaValues,
} from '@bridge-ui/components/api-endpoint-form-steps/schema';
import { IntegrationDetails } from '@bridge-ui/components/api-endpoint-form-steps/integration-details';
import useSearchParam from '@sharedui/hooks/useSearchParam';

const steps: MultiStepFormStep[] = [
  {
    title: 'API endpoint details',
    component: <EndpointDetails />,
    validateNext: (form) => form.trigger(['path', 'method']),
  },
  {
    title: 'Integration details',
    component: <IntegrationDetails />,
    validateNext: (form) => form.trigger(['integration']),
  },
];

export const UpdateApiEndpointPage = () => {
  const form = useForm<SchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      path: '/',
      method: BridgeApiEndpointMethod.GET,
    },
  });
  const navigate = useNavigate();
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
  const { data: { endpoint } = {} } = useReadApiEndpointQuery(
    { apiFrn, endpointFrn },
    { skip: !apiId || !endpointId },
  );
  const [updateApiEndpoint, { isLoading }] = useUpdateApiEndpointMutation();

  const handleCreateEndpoint = async (values: z.infer<typeof schema>) => {
    if (!apiId || isLoading) return;

    try {
      const endpointFrn = generateFRN(
        'bridge',
        user?.accountId ?? '',
        'endpoint',
        endpointId,
      );
      await updateApiEndpoint({
        apiFrn,
        endpointFrn,
        endpoint: values,
      }).unwrap();
      toast.success('API endpoint updated successfully');
      form.reset();
      navigate(bridgePaths.API_ENDPOINT_DETAILS(apiId, endpointId ?? ''), {
        replace: true,
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <MultiStepForm
      title="Update API endpoint"
      description="An API endpoint is a specific URL in an API that accepts requests from clients. You can create multiple endpoints for an API."
      className="mx-auto p-6"
      schema={schema}
      defaultValues={endpoint as SchemaValues}
      steps={steps}
      submitButtonText="Update endpoint"
      onSubmit={handleCreateEndpoint}
      onCancel={() =>
        navigate(bridgePaths.API_DETAILS(apiId ?? ''), {
          replace: true,
        })
      }
    />
  );
};
