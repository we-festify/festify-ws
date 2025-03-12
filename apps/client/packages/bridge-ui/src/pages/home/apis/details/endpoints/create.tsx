import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { bridgePaths } from '@sharedui/constants/paths';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateApiEndpointMutation } from '@bridge-ui/api/apis';

import { BridgeApiEndpointMethod } from '@sharedtypes/bridge';
import { useAuth } from '@rootui/providers/auth-provider';
import { generateFRN } from '@sharedui/utils/frn';

import MultiStepForm, {
  MultiStepFormStep,
} from '@sharedui/components/multi-step-form';
import { EndpointDetails } from '@bridge-ui/components/api-endpoint-form-steps/endpoint-details';
import {
  defaultValues,
  schema,
  SchemaValues,
} from '@bridge-ui/components/api-endpoint-form-steps/schema';
import { IntegrationDetails } from '@bridge-ui/components/api-endpoint-form-steps/integration-details';

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

export const CreateApiEndpointPage = () => {
  const form = useForm<SchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      path: '/',
      method: BridgeApiEndpointMethod.GET,
    },
  });
  const navigate = useNavigate();
  const { apiId } = useParams();
  const [createApiEndpoint, { isLoading }] = useCreateApiEndpointMutation();
  const { user } = useAuth();

  const handleCreateEndpoint = async (values: z.infer<typeof schema>) => {
    if (!apiId || isLoading) return;

    try {
      const apiFrn = generateFRN('bridge', user?.accountId ?? '', 'api', apiId);
      await createApiEndpoint({ frn: apiFrn, endpoint: values }).unwrap();
      toast.success('API endpoint created successfully');
      form.reset();
      navigate(bridgePaths.API_ENDPOINT_DETAILS(apiId, ''), { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <MultiStepForm
      title="Create API endpoint"
      description="An API endpoint is a specific URL in an API that accepts requests from clients. You can create multiple endpoints for an API."
      className="mx-auto p-6"
      schema={schema}
      defaultValues={defaultValues}
      steps={steps}
      submitButtonText="Create endpoint"
      onSubmit={handleCreateEndpoint}
      onCancel={() =>
        navigate(bridgePaths.API_DETAILS(apiId ?? ''), {
          replace: true,
        })
      }
    />
  );
};
