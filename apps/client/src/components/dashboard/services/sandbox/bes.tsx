import { useState } from 'react';
import { useGetEmailTemplatesQuery } from '@client/api/d/bes/emailTemplates';
import { useGetInstancesQuery } from '@client/api/instances';
import { useGetServiceMetaByTypeQuery } from '@client/api/services';
import { Button } from '@client/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';
import { Textarea } from '@client/components/ui/textarea';

interface Instance {
  _id: string;
  name: string;
  apiKey: string;
}

interface MethodParam {
  name: string;
  type: string;
  ref?: string;
}

interface Method {
  name: string;
  params: MethodParam[];
  method: string;
  path: string;
}

interface EmailTemplate {
  _id: string;
  name: string;
  variables: string[];
  [key: string]: any; // This is a hack to allow any key in the object
}

const BESSandbox = () => {
  const { data: { instances = [] } = {} } = useGetInstancesQuery('bes');
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(
    instances?.[0] || null
  );

  const { data: { service = {} } = {} } = useGetServiceMetaByTypeQuery('bes');
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(
    service.methods?.[0] || null
  );

  const { data: { templates } = {} } = useGetEmailTemplatesQuery({
    instanceId: selectedInstance?._id,
  });
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(templates?.[0] || null);

  const [response, setResponse] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = () => {
    try {
      if (!selectedInstance || !selectedMethod || !selectedTemplate) return;

      const url = `${service.baseUrl}${selectedMethod.path}`;
      const method = selectedMethod.method;
      const body = JSON.parse(
        (document.querySelector('textarea') as HTMLTextAreaElement).value
      );
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${selectedInstance.apiKey}`,
      };

      console.log({
        url,
        method,
        headers,
        body: JSON.stringify(body),
        mode: 'no-cors',
      });

      setIsRequesting(true);
      fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
        mode: 'cors',
      })
        .then((res) => res.json())
        .then((data) => {
          // Update response
          setResponse(JSON.stringify(data, null, 2));
        })
        .catch((error) => {
          setResponse(JSON.stringify(error, null, 2));
        })
        .finally(() => {
          setIsRequesting(false);
        });
    } catch (error: any) {
      setResponse(error.message);
      setIsRequesting(false);
    }
  };

  const createEmptyBodyObject = (
    method: Method | null,
    template: EmailTemplate | null
  ) => {
    const body: any = {};

    if (method) {
      method.params.forEach((param) => {
        if (param.type === 'object') {
          body[param.name] = {} as any;
          try {
            if (param.ref) {
              const refKey = param.ref as string;
              const refData = template?.[refKey] || '';

              if (Array.isArray(refData)) {
                refData.forEach((ref: string) => {
                  body[param.name][ref] = '' as string;
                });
              } else if (refData && typeof refData === 'string') {
                body[param.name][refData] = template?.[refData] || '';
              }
            }
          } catch (error) {
            console.error(error);
          }
        } else if (param.type === 'array') {
          body[param.name] = [] as any;
        } else {
          body[param.name] = '' as string;

          if (param.ref) {
            const refKey = param.ref as string;
            const refData = template?.[refKey] || '';

            if (refData && typeof refData === 'string') {
              body[param.name] = refData;
            }
          }
        }
      });
    }

    return body;
  };

  const captureTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      e.currentTarget.value =
        e.currentTarget.value.substring(0, start) +
        '\t' +
        e.currentTarget.value.substring(end);

      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* <h1 className="text-xl font-semibold">API Sandbox</h1> */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Request</h2>
        <div className="flex gap-4">
          <Select
            onValueChange={(_id) =>
              setSelectedInstance(
                instances.find((instance: Instance) => instance._id === _id)
              )
            }
            defaultValue={selectedInstance?._id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select instance" />
            </SelectTrigger>
            <SelectContent>
              {instances.map((instance: Instance) => (
                <SelectItem
                  key={instance._id}
                  value={instance._id}
                  className="cursor-pointer"
                >
                  {instance.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            key={selectedInstance?._id + 'method'}
            onValueChange={(name) =>
              setSelectedMethod(
                service.methods.find((method: Method) => method.name === name)
              )
            }
            defaultValue={selectedMethod?.name}
            disabled={!selectedInstance?._id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {service.methods?.map((method: Method) => (
                <SelectItem
                  key={method.name}
                  value={method.name}
                  onClick={() => setSelectedMethod(method)}
                  className="cursor-pointer"
                >
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            key={selectedInstance?._id + 'template'}
            onValueChange={(_id) =>
              setSelectedTemplate(
                templates.find(
                  (template: EmailTemplate) => template._id === _id
                )
              )
            }
            defaultValue={selectedTemplate?._id}
            disabled={!selectedInstance?._id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates?.map((template: EmailTemplate) => (
                <SelectItem
                  key={template._id}
                  value={template._id}
                  onClick={() => setSelectedTemplate(template)}
                  className="cursor-pointer"
                >
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRequest}>Send request</Button>
        </div>
        <div className="grid grid-cols-2 space-x-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Body</h2>
            <Textarea
              key={
                (selectedInstance?._id || '') +
                (selectedMethod?.name || '') +
                (selectedTemplate?._id || '')
              }
              placeholder="Enter request body"
              spellCheck={false}
              className="rounded-lg p-4 h-72 resize-none text-sm font-mono bg-muted/50 text-muted-foreground"
              defaultValue={JSON.stringify(
                createEmptyBodyObject(selectedMethod, selectedTemplate),
                null,
                2
              )}
              onKeyDown={captureTab}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">Response</h1>
            <div className="border text-muted-foreground bg-muted/50 rounded-lg p-4 h-full overflow-x-auto">
              <pre className="text-sm">
                {isRequesting
                  ? 'Requesting...'
                  : response || 'Response will appear here'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BESSandbox;
