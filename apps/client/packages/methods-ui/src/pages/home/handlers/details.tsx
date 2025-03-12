import { zodResolver } from '@hookform/resolvers/zod';
import {
  useDeleteHandlersMutation,
  useReadHandlerQuery,
  useUpdateHandlerMutation,
} from '@methods-ui/api/handlers';
import { CodeEditor } from '@methods-ui/components/code-editor';
import { useAuth } from '@rootui/providers/auth-provider';
import CopyIcon from '@sharedui/components/copy-icon';
import DeleteButton from '@sharedui/components/delete-button';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import PageSection from '@sharedui/components/page-section';
import { methodsPaths } from '@sharedui/constants/paths';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { Form, FormField } from '@sharedui/primitives/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sharedui/primitives/select';
import { getErrorMessage } from '@sharedui/utils/error';
import { generateFRN, readableFRN } from '@sharedui/utils/frn';
import { cn } from '@sharedui/utils/tw';
import { Maximize, Minimize, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

export const HandlerDetailsPage = () => {
  const { handlerId } = useParams();
  const { user } = useAuth();
  const handlerFrn = generateFRN(
    'methods',
    user?.accountId ?? '',
    'handler',
    handlerId ?? '',
  );
  const {
    data: { handler } = {},
    refetch,
    isLoading: isLoadingHandler,
  } = useReadHandlerQuery(handlerFrn ?? '', {
    skip: !handlerId,
  });
  const [deleteHandlers, { isLoading: isDeleting }] =
    useDeleteHandlersMutation();
  const navigate = useNavigate();

  const handleDeleteHandler = async () => {
    try {
      await deleteHandlers([handlerFrn]).unwrap();
      toast.success('Handler deleted successfully');
      navigate(methodsPaths.HANDLERS, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8">
      <PageSection
        title={handler?.alias}
        header={
          <div className="flex items-center justify-end gap-4">
            <DeleteButton
              size="sm"
              variant="destructive-outline"
              disabled={isDeleting || isLoadingHandler}
              onClick={handleDeleteHandler}
              description="This action cannot be undone. This will permanently delete the endpoint."
            >
              Delete
            </DeleteButton>
            <Button
              name="Refresh instances"
              size="sm"
              variant="outline"
              disabled={isLoadingHandler}
              onClick={refetch}
            >
              <RotateCw size={16} className="text-muted-foreground" />
            </Button>
            <Link
              to={methodsPaths.CREATE_NEW_HANDLER}
              className={buttonVariants({
                size: 'sm',
                variant: 'secondary',
              })}
            >
              Create new handler
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader variant="muted">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Handler details</h2>
                {handler && (
                  <Link
                    to={methodsPaths.UPDATE_HANDLER(handlerId ?? '')}
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
                data={handler ?? {}}
                colsCount={3}
                keys={[
                  {
                    key: 'frn',
                    label: 'Festify Resource Name (FRN)',
                    formatter: (_: unknown) => {
                      const value = readableFRN(handlerFrn);
                      return (
                        <div className="flex items-center gap-2">
                          <span>{value}</span>
                          <CopyIcon value={value} />
                        </div>
                      );
                    },
                  },
                  { label: 'Alias', key: 'alias' },
                  { label: 'Description', key: 'description' },
                  {
                    label: 'Code hash',
                    key: 'codeHash',
                    formatter: (value: unknown) => {
                      const clippedValue = `${value}`.substring(0, 20) + '...';
                      return (
                        <div className="flex items-center gap-2">
                          <span>{clippedValue}</span>
                          <CopyIcon value={`${value}`} />
                        </div>
                      );
                    },
                  },
                  { label: 'Code size in bytes', key: 'codeSizeInBytes' },
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader variant="muted">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Handler configuration</h2>
                {handler && (
                  <Link
                    to={methodsPaths.UPDATE_HANDLER(handlerId ?? '')}
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
                data={handler ?? {}}
                colsCount={3}
                keys={[
                  { label: 'Runtime', key: 'runtime' },
                  { label: 'Timeout in seconds', key: 'timeoutInSeconds' },
                  { label: 'Memory in MB', key: 'memoryInMB' },
                ]}
              />
            </CardContent>
          </Card>
          <HandlerCodeForm />
        </div>
      </PageSection>
    </div>
  );
};

const schema = z.object({
  codeSource: z.string().max(5000),
});

type SchemaValues = z.infer<typeof schema>;

type CodeEditorTheme = 'vs' | 'vs-dark' | 'hc-black';
const THEMES = [
  { value: 'vs', label: 'Light' },
  { value: 'vs-dark', label: 'Dark' },
  { value: 'hc-black', label: 'High contrast' },
];

const HandlerCodeForm = () => {
  const { handlerId } = useParams();
  const { user } = useAuth();
  const handlerFrn = generateFRN(
    'methods',
    user?.accountId ?? '',
    'handler',
    handlerId ?? '',
  );
  const { data: { handler } = {}, isLoading } = useReadHandlerQuery(
    handlerFrn ?? '',
    {
      skip: !handlerId,
    },
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const form = useForm<SchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      codeSource: handler?.codeSource ?? '',
    },
  });
  const [updateHandler] = useUpdateHandlerMutation();
  const [theme, setTheme] = useState<(typeof THEMES)[number]['value']>('vs');

  useEffect(() => {
    if (!handler) return;
    form.setValue('codeSource', handler.codeSource);
  }, [form, handler]);

  const handleSaveCodeSource = async (values: SchemaValues) => {
    try {
      await updateHandler({
        frn: handlerFrn,
        handler: {
          codeSource: values.codeSource,
        },
      }).unwrap();
      toast.success('Code source saved successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Card className={isFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveCodeSource)}>
          <CardHeader variant="muted">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Code source</h2>
              <div className="flex items-center gap-4">
                {handler && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 font-normal"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
                  </Button>
                )}
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFullScreen(!isFullScreen);
                  }}
                  className="size-8"
                >
                  {isFullScreen ? (
                    <Minimize size={14} />
                  ) : (
                    <Maximize size={14} />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="codeSource"
              render={({ field }) =>
                isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    Loading...
                  </div>
                ) : (
                  <CodeEditor
                    key="codeSource"
                    {...field}
                    theme={theme as CodeEditorTheme}
                    defaultValue={field?.value}
                  />
                )
              }
            />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};
