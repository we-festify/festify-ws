import { useParams } from 'react-router-dom';
import EmailTemplatesSidebar from './Sidebar';
import { useGetEmailTemplatesQuery } from '../../../../../../api/d/bes/emailTemplates';
import { useState } from 'react';
import EmailTemplateEditor from './TemplateEditor';

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

const EmailTemplates = () => {
  const params = useParams<{ instanceId: string }>();
  const { instanceId } = params;
  const { data: { templates = [] } = {} } = useGetEmailTemplatesQuery({
    instanceId,
  });

  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(templates?.[0] || null);

  const handleSelectTemplate = (template: EmailTemplate | null) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="flex gap-8">
      <EmailTemplatesSidebar
        selectedTemplate={selectedTemplate}
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
      />
      <EmailTemplateEditor
        template={selectedTemplate}
        onSelectChange={handleSelectTemplate}
      />
    </div>
  );
};

export default EmailTemplates;
