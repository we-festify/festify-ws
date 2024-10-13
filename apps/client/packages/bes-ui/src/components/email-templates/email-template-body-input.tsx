import { Textarea } from '@sharedui/primitives/textarea';
import { FormField, FormFieldItem } from '@sharedui/primitives/form';
import { useForm } from 'react-hook-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sharedui/primitives/tabs';

interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
}

interface EmailTeplateBodyInputProps {
  form: ReturnType<typeof useForm<EmailTemplate>>;
}

const EmailTemplateBodyInput = ({ form }: EmailTeplateBodyInputProps) => {
  return (
    <FormField
      control={form.control}
      name="body"
      render={({ field }) => (
        <FormFieldItem
          label="Body of the email"
          description="The body of the email that will be sent to the recipients."
        >
          <Tabs defaultValue="simple">
            <TabsList>
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="html" disabled>
                HTML (coming soon)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simple" className="mt-4">
              <Textarea
                key="email-body"
                placeholder="raw text body"
                {...field}
              />
            </TabsContent>
            <TabsContent value="html">Coming soon.</TabsContent>
          </Tabs>
        </FormFieldItem>
      )}
    />
  );
};

export default EmailTemplateBodyInput;
