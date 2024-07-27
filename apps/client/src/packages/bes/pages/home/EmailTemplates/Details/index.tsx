import { formatTimeFromNow } from '@shared/utils/time';
import PageSection from '../../../../../shared/components/PageSection';
import EmailTemplateSummary from '../../../../components/EmailTemplates/EmailTemplateSummary';
import EmailTemplatePreview from '../../../../components/EmailTemplates/EmailTemplatePreview';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteEmailTemplatesMutation,
  useGetEmailTemplateByIdQuery,
} from '../../../../api/emailTemplates';
import { Button, buttonVariants } from '../../../../../shared/ui/button';
import { RotateCw } from 'lucide-react';
import { paths } from '../../../../constants/paths';
import { getErrorMessage } from '../../../../../shared/utils/error';
import { toast } from 'sonner';
import { BESEmailTemplateType } from '@shared/types/bes';

const EmailTemplateDetailsPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { data: { template } = {}, refetch } = useGetEmailTemplateByIdQuery<{
    data: { template: BESEmailTemplateType };
  }>(templateId);
  const navigate = useNavigate();
  const [deleteEmailTemplates] = useDeleteEmailTemplatesMutation();

  const handleDeleteTemplate = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!template) return;

    try {
      await deleteEmailTemplates([template._id]).unwrap();
      navigate(paths.EMAIL_TEMPLATES);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefreshTemplate = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      await refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!template) return null;

  return (
    <div className="p-8">
      <PageSection
        title={template.name}
        description={`Created ${formatTimeFromNow(
          template.createdAt.toString()
        )}`}
        header={
          <div className="flex items-center justify-end gap-4">
            <Button
              size="sm"
              variant="destructive-outline"
              onClick={handleDeleteTemplate}
            >
              Delete
            </Button>
            <Button
              name="Refresh instances"
              size="sm"
              variant="outline"
              onClick={handleRefreshTemplate}
            >
              <RotateCw size={16} className="text-muted-foreground" />
            </Button>
            <Link
              to={paths.CREATE_NEW_EMAIL_TEMPLATE}
              className={buttonVariants({
                size: 'sm',
                variant: 'secondary',
              })}
            >
              Create template
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          <EmailTemplateSummary template={template} />
          <EmailTemplatePreview template={template} />
        </div>
      </PageSection>
    </div>
  );
};

export default EmailTemplateDetailsPage;
