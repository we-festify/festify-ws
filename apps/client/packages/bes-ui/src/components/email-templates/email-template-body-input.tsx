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
  text: string;
  html: string;
}

interface EmailTeplateBodyInputProps {
  form: ReturnType<typeof useForm<EmailTemplate>>;
}

const EmailTemplateBodyInput = ({ form }: EmailTeplateBodyInputProps) => {
  return (
    <Tabs defaultValue="text">
      <TabsList>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="html">HTML</TabsTrigger>
      </TabsList>
      <TabsContent value="text" className="mt-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormFieldItem
              label="Email Body (Text)"
              description="This is the raw text body of the email. Use this field to write the email body in plain text format."
            >
              <Textarea
                key="email-body"
                placeholder="raw text body"
                {...field}
              />
            </FormFieldItem>
          )}
        />
      </TabsContent>
      <TabsContent value="html" className="mt-4">
        <FormField
          control={form.control}
          name="html"
          render={({ field }) => (
            <FormFieldItem
              label="Email Body (HTML)"
              description="This is the html body of the email. Use this field to write the email body in html format."
            >
              <Textarea key="email-body" placeholder="html body" {...field} />
            </FormFieldItem>
          )}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmailTemplateBodyInput;
