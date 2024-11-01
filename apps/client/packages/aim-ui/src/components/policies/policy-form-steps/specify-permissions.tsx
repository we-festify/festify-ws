import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sharedui/primitives/card';
import PageSection from '@sharedui/components/page-section';
import FormSection from '@sharedui/components/form-section';
import {
  FormDescription,
  FormField,
  FormFieldItem,
  FormLabel,
} from '@sharedui/primitives/form';
import { useMultiStepForm } from '@sharedui/components/multi-step-form';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@sharedui/primitives/command';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@sharedui/primitives/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sharedui/primitives/popover';
import {
  useGetActionsByServiceQuery,
  useGetServicesMetadataQuery,
} from '@rootui/api/meta';
import { useState } from 'react';
import { Button } from '@sharedui/primitives/button';
import { ChevronsUpDown, CopyPlus, Trash } from 'lucide-react';
import { Checkbox } from '@sharedui/primitives/checkbox';
import {
  IPermissionPolicyRule,
  PermissionPolicyAction,
  PermissionPolicyResource,
} from '@sharedtypes/aim/permission-policy';
import { Label } from '@sharedui/primitives/label';
import { cn } from '@sharedui/utils/tw';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { RadioGroup, RadioGroupItem } from '@sharedui/primitives/radio-group';
import { Textarea } from '@sharedui/primitives/textarea';
import Help from '@sharedui/components/help';

const SpecifyPermissions = () => {
  return (
    <PageSection>
      <Card>
        <CardContent>
          <FormSection
            title="Policy editor"
            description="Define the permissions for the policy."
          ></FormSection>
        </CardContent>
      </Card>
      <RulesInput />
    </PageSection>
  );
};

const RulesInput = () => {
  const { form } = useMultiStepForm();
  const [forceUpdate, setForceUpdate] = useState(0);
  const rules = form.watch('rules', [
    {
      service: '',
      effect: 'allow',
      actions: [] as PermissionPolicyAction[],
      resources: [] as PermissionPolicyResource[],
    },
  ]);

  const addRule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForceUpdate((forceUpdate + 1) % 2);
    form.setValue(
      'rules',
      [
        ...rules,
        {
          effect: 'allow',
          actions: [] as PermissionPolicyAction[],
          resources: [] as PermissionPolicyResource[],
        },
      ],
      { shouldDirty: true },
    );
  };

  const cloneRule = (index: number) => {
    setForceUpdate((forceUpdate + 1) % 2);
    const start = rules.slice(0, index + 1);
    const end = rules.slice(index + 1);
    form.setValue('rules', [...start, rules[index], ...end], {
      shouldDirty: true,
    });
  };

  const removeRule = (index: number) => {
    setForceUpdate((forceUpdate + 1) % 2);
    form.setValue(
      'rules',
      rules.filter((_: IPermissionPolicyRule, i: number) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <>
      <FormField
        name="rules"
        control={form.control}
        render={() => (
          <FormFieldItem>
            <div className="space-y-4 mt-4">
              {rules.map((rule: IPermissionPolicyRule, index: number) => (
                <RuleInput
                  key={`${rule.effect}-${index}`}
                  index={index}
                  onClone={cloneRule}
                  onRemove={removeRule}
                />
              ))}
            </div>
          </FormFieldItem>
        )}
      />
      <Button variant="outline" onClick={addRule} className="mt-4">
        Add rule
      </Button>
    </>
  );
};

interface RuleInputProps {
  index: number;
  onClone: (index: number) => void;
  onRemove: (index: number) => void;
}

const RuleInput = ({ index, onClone, onRemove }: RuleInputProps) => {
  const { form } = useMultiStepForm();
  const { data: { services } = {} } = useGetServicesMetadataQuery();
  const serviceAlias = form.watch(`rules.${index}.service`) as string;
  const service = services?.find((s) => s.alias === serviceAlias);
  const effect = form.watch(`rules.${index}.effect`);
  const [forceUpdate, setForceUpdate] = useState(true);

  return (
    <Card>
      {service && (
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{service.shortName}</CardTitle>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    effect === 'allow'
                      ? 'bg-green-700 text-secondary-foreground'
                      : 'bg-destructive text-destructive-foreground',
                  )}
                >
                  {effect === 'allow' ? 'Allow' : 'Deny'}
                </span>
              </div>
              <CardDescription>
                Define the actions and resources for {service.name}.
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name={`rules.${index}.effect`}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    className="flex gap-6 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value="allow" />
                      Allow
                    </span>
                    <span className="flex items-center gap-2">
                      <RadioGroupItem value="deny" />
                      Deny
                    </span>
                  </RadioGroup>
                )}
              />
              <Button
                variant="outline"
                size="sm"
                name="Clone rule"
                onClick={() => onClone(index)}
              >
                <CopyPlus size={16} className="text-muted-foreground" />
              </Button>
              <Button
                variant="destructive-outline"
                size="sm"
                name="Remove rule"
                onClick={() => onRemove(index)}
                className="text-muted-foreground"
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {!service && (
          <FormField
            control={form.control}
            name={`rules.${index}.service`}
            render={({ field }) => (
              <FormFieldItem
                label="Service"
                description="Select the service for which you want to define permissions."
              >
                <ServiceCombobox
                  onSelect={(value) => {
                    field.onChange(value);
                    setForceUpdate(!forceUpdate);
                  }}
                />
              </FormFieldItem>
            )}
          />
        )}
        {service && (
          <div className="space-y-6">
            <ActionsInput index={index} service={service.alias} />
            <ResourcesInput index={index} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ActionsInputProps {
  index: number;
  service: string;
}

const filterActions = (
  actions: PermissionPolicyAction[],
  actionToRemove: PermissionPolicyAction,
) => {
  return actions.filter(
    (value: PermissionPolicyAction) => value !== actionToRemove,
  );
};

const ActionsInput = ({ index, service }: ActionsInputProps) => {
  const { data: { actions } = {}, isLoading } =
    useGetActionsByServiceQuery(service);
  const { form } = useMultiStepForm();
  const [areActionsVisible, setAreActionsVisible] = useState(false);

  return (
    <FormField
      control={form.control}
      name={`rules.${index}.actions`}
      render={({ field }) => (
        <FormFieldItem>
          <Collapsible
            onOpenChange={setAreActionsVisible}
            open={areActionsVisible}
          >
            <CollapsibleTrigger>
              <div className="flex gap-4">
                <TriangleRightIcon
                  className={cn(
                    'size-5 text-muted-foreground transition-transform',
                    areActionsVisible ? 'transform rotate-90' : '',
                  )}
                />
                <div className="flex flex-col items-start">
                  <FormLabel>
                    Actions{' '}
                    {field.value?.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({field.value.length}/{actions?.length} selected)
                      </span>
                    )}
                  </FormLabel>
                  <FormDescription>
                    Select the actions that can be performed on the resources
                    specified.
                  </FormDescription>
                </div>
              </div>
            </CollapsibleTrigger>
            {isLoading && (
              <span className="text-muted-foreground">Loading...</span>
            )}
            <CollapsibleContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pl-9">
                {actions ? (
                  actions?.map((action) => (
                    <span
                      key={action.alias}
                      className="flex gap-3 items-center"
                    >
                      <Checkbox
                        value={action.alias}
                        checked={field.value?.includes(action.alias)}
                        onCheckedChange={(checked) => {
                          const actions = checked
                            ? ([
                                ...(field.value || []),
                                action.alias,
                              ] as PermissionPolicyAction[])
                            : filterActions(field.value, action.alias);
                          form.setValue(`rules.${index}.actions`, actions);
                        }}
                      />
                      <Label>{action.alias.split(':')[1]}</Label>
                      {action.description && (
                        <Help variant="muted">{action.description}</Help>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-destructive text-sm">
                    No actions found.
                  </span>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </FormFieldItem>
      )}
    />
  );
};

const ResourcesInput = ({ index }: { index: number }) => {
  const { form } = useMultiStepForm();
  const [areResourcesVisible, setAreResourcesVisible] = useState(false);
  const [areAllResourcesAllowed, setAreAllResourcesAllowed] = useState('true');

  return (
    <FormField
      control={form.control}
      name={`rules.${index}.resources`}
      render={({ field }) => (
        <FormFieldItem>
          <Collapsible
            onOpenChange={setAreResourcesVisible}
            open={areResourcesVisible}
          >
            <CollapsibleTrigger>
              <div className="flex gap-4">
                <TriangleRightIcon
                  className={cn(
                    'size-5 text-muted-foreground transition-transform',
                    areResourcesVisible ? 'transform rotate-90' : '',
                  )}
                />
                <div className="flex flex-col items-start">
                  <FormLabel>
                    Resources{' '}
                    {field.value?.length == 0 && (
                      <span className="text-xs text-muted-foreground">
                        (all)
                      </span>
                    )}
                  </FormLabel>
                  <FormDescription>
                    Select the resources on which the actions can be performed.
                  </FormDescription>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4 pl-9">
                <RadioGroup
                  value={areAllResourcesAllowed}
                  onValueChange={(value) => {
                    setAreAllResourcesAllowed(value);
                    form.setValue(`rules.${index}.resources`, []);
                  }}
                  className="flex flex-col text-sm"
                >
                  <span className="flex items-center gap-2">
                    <RadioGroupItem value={'true'} />
                    Allow all resources
                  </span>
                  <span className="flex items-center gap-2">
                    <RadioGroupItem value={'false'} />
                    Specify resources
                  </span>
                </RadioGroup>
                {areAllResourcesAllowed === 'false' && (
                  <div className="mt-4">
                    <Label>Add resource FRNs</Label>
                    <Textarea
                      value={field.value.join('\n')}
                      onChange={(e) =>
                        form.setValue(
                          `rules.${index}.resources`,
                          e.currentTarget.value.split('\n'),
                        )
                      }
                      className="mt-2"
                      placeholder="frn:aim::user:123 (one per line)"
                    />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </FormFieldItem>
      )}
    />
  );
};

interface ServiceComboboxProps {
  onSelect: (value: string | undefined) => void;
}

const ServiceCombobox = ({ onSelect }: ServiceComboboxProps) => {
  const { data: { services } = {}, isLoading } = useGetServicesMetadataQuery();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={(e) => e.stopPropagation()}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Select a service'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {services?.map((service) => (
                <CommandItem
                  key={service.alias}
                  value={service.alias}
                  onSelect={(currentValue) => {
                    onSelect(
                      services.find((s) => s.alias === currentValue)?.alias,
                    );
                    setOpen(false);
                  }}
                >
                  {service.name} ({service.shortName})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SpecifyPermissions;
