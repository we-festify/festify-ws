import FormSection from '@sharedui/components/form-section';
import { useMultiStepForm } from '@sharedui/components/multi-step-form';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { FormField, FormFieldItem } from '@sharedui/primitives/form';
import { SchemaValues } from './schema';
import { RadioGroup, RadioGroupItem } from '@sharedui/primitives/radio-group';
import { cn } from '@sharedui/utils/tw';
import { useWatch } from 'react-hook-form';
import { Input } from '@sharedui/primitives/input';
import { BridgeApiEndpointMethod } from '@sharedtypes/bridge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@sharedui/primitives/select';
import { useState } from 'react';
import { Button } from '@sharedui/primitives/button';
import { Plus, RotateCw, Trash2 } from 'lucide-react';
import { useListHandlersQuery } from '@methods-ui/api/handlers';
import { generateFRN } from '@sharedui/utils/frn';
import { useAuth } from '@rootui/providers/auth-provider';

export const IntegrationDetails = () => {
  const { form } = useMultiStepForm<SchemaValues>();
  const integrationType = useWatch({
    control: form.control,
    name: 'integration.type',
    defaultValue: form.getValues('integration.type') || 'http',
  });
  const { user } = useAuth();
  const {
    data: { handlers } = {},
    refetch: refetchMethods,
    isLoading: areHandlersLoading,
  } = useListHandlersQuery();

  return (
    <PageSection>
      <Card>
        <CardContent>
          <FormSection
            title="Integration details"
            description="Integrate your API with other services by adding the details of the endpoint."
          >
            <div className="flex flex-col gap-6 pb-6">
              <FormField
                control={form.control}
                name="integration.type"
                render={({ field }) => (
                  <FormFieldItem
                    label="Integration type"
                    description="The type of integration that you want to use for the endpoint."
                    variant="aligned"
                  >
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-4 flex-wrap"
                    >
                      <IntegrationRadioItem
                        selected={field.value}
                        value="http"
                        label="HTTP"
                        description="Integrate with an HTTP endpoint."
                      />
                      <IntegrationRadioItem
                        selected={field.value}
                        value="method"
                        label="FWS Method"
                        description="Integrate with an FWS method."
                      />
                      <IntegrationRadioItem
                        selected={field.value}
                        value="mock"
                        label="Mock"
                        description="Integrate with a mock endpoint."
                      />
                    </RadioGroup>
                  </FormFieldItem>
                )}
              />
              {integrationType === 'http' && (
                <>
                  <FormField
                    control={form.control}
                    name="integration.method"
                    render={({ field }) => (
                      <FormFieldItem
                        label="HTTP method"
                        description="The HTTP method to use when calling the endpoint."
                        variant="aligned"
                      >
                        <div className="md:w-2/3">
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a method" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(BridgeApiEndpointMethod).map(
                                (method: string) => (
                                  <SelectItem key={method} value={method}>
                                    {method}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormFieldItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="integration.url"
                    render={({ field }) => (
                      <FormFieldItem
                        label="URL"
                        description="The URL of the HTTP endpoint that you want to integrate with."
                        variant="aligned"
                      >
                        <div className="md:w-2/3">
                          <Input
                            key="http-url"
                            placeholder="http://example.com"
                            type="url"
                            {...field}
                          />
                        </div>
                      </FormFieldItem>
                    )}
                  />
                </>
              )}
              {integrationType === 'method' && (
                <>
                  <FormField
                    control={form.control}
                    name="integration.frn"
                    render={({ field }) => (
                      <FormFieldItem
                        label="FWS Method"
                        description="The FWS method FRN that you want to integrate with."
                        variant="aligned"
                      >
                        <div className="md:w-2/3 flex gap-2">
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup title="My methods">
                                <SelectLabel>My methods</SelectLabel>
                                {handlers?.map(({ alias }) => {
                                  const handlerFrn = generateFRN(
                                    'methods',
                                    user?.accountId || '',
                                    'handler',
                                    alias,
                                  );
                                  return (
                                    <SelectItem
                                      key={handlerFrn}
                                      value={handlerFrn}
                                    >
                                      {alias}
                                    </SelectItem>
                                  );
                                })}
                                {areHandlersLoading && (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Button
                            name="Refresh handlers"
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              refetchMethods();
                            }}
                          >
                            <RotateCw
                              size={16}
                              className="text-muted-foreground"
                            />
                          </Button>
                        </div>
                      </FormFieldItem>
                    )}
                  />
                </>
              )}
              {integrationType === 'mock' && (
                <>
                  <FormField
                    control={form.control}
                    name="integration.statusCode"
                    render={({ field }) => (
                      <FormFieldItem
                        label="Status code"
                        description="The status code to return when calling the mock endpoint."
                        variant="aligned"
                      >
                        <div className="md:w-2/3">
                          <Input
                            key="mock-status-code"
                            placeholder="200"
                            type="number"
                            {...field}
                          />
                        </div>
                      </FormFieldItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="integration.body"
                    render={({ field }) => (
                      <FormFieldItem
                        label="Response body"
                        description="The response body to return when calling the mock endpoint."
                        variant="aligned"
                      >
                        <div className="md:w-2/3">
                          <Input key="mock-body" placeholder="{}" {...field} />
                        </div>
                      </FormFieldItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="integration.headers"
                    render={({ field }) => (
                      <FormFieldItem
                        label="Response headers"
                        description="The response headers to return when calling the mock endpoint."
                        variant="aligned"
                      >
                        <div className="md:w-2/3">
                          <HeadersInput
                            defaultValue={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormFieldItem>
                    )}
                  />
                </>
              )}
            </div>
          </FormSection>
        </CardContent>
      </Card>
    </PageSection>
  );
};

const IntegrationRadioItem = ({
  selected,
  value,
  label,
  description,
}: {
  selected: string;
  value: string;
  label: string;
  description: string;
}) => (
  <label
    htmlFor={value}
    className={cn(
      'flex gap-2 rounded-md p-2 ring-1 cursor-default',
      selected === value
        ? 'ring-secondary bg-secondary/5'
        : 'ring-muted-foreground',
    )}
  >
    <RadioGroupItem value={value} id={value} />
    <div className="flex flex-col">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </label>
);

const HeadersInput = ({
  defaultValue,
  onChange,
}: {
  defaultValue: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) => {
  const [inputValue, setInputValue] = useState<
    { key: string; value: string }[]
  >(Object.entries(defaultValue).map(([key, value]) => ({ key, value })));

  const handleInputChange = (index: number, key: string, value: string) => {
    const updatedValue = [...inputValue];
    updatedValue[index] = { key, value };
    setInputValue(updatedValue);
    onChange(
      updatedValue.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  };

  const handleAddHeader = (e: React.MouseEvent) => {
    e.preventDefault();
    setInputValue([...inputValue, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    setInputValue(inputValue.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {inputValue.map(({ key, value }, index) => (
        <div key={index} className="w-full flex items-center gap-2">
          <Input
            key={`header-key-${index}`}
            placeholder="Key"
            value={key}
            onChange={(e) => handleInputChange(index, e.target.value, value)}
            className="flex-1"
          />
          <Input
            key={`header-value-${index}`}
            placeholder="Value"
            value={value}
            onChange={(e) => handleInputChange(index, key, e.target.value)}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveHeader(index);
            }}
            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Remove header"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button
        size="icon"
        variant="outline"
        onClick={handleAddHeader}
        className="size-8"
        title="Add header"
      >
        <Plus size={14} />
      </Button>
    </div>
  );
};
