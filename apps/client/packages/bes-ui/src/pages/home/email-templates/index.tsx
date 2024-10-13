import { DataTable } from '@sharedui/primitives/data-table';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { columns } from '../../../components/email-templates/email-templates-table/columns';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { besPaths } from '@sharedui/constants/paths';
import { RotateCw } from 'lucide-react';
import {
  useDeleteEmailTemplatesMutation,
  useGetEmailTemplatesQuery,
} from '../../../api/email-templates';
import { IBESEmailTemplate } from '@sharedtypes/bes';
import { getErrorMessage } from '@sharedui/utils/error';
import { toast } from 'sonner';
import { Table } from '@tanstack/react-table';

const EmailTemplates = () => {
  const { data: { templates = [] } = {}, refetch } = useGetEmailTemplatesQuery(
    {},
  );
  const [deleteEmailTemplates] = useDeleteEmailTemplatesMutation();

  const handleDelete = async (rows: IBESEmailTemplate[]) => {
    try {
      await deleteEmailTemplates(rows.map((row) => row._id)).unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefetch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await refetch().unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8">
      <PageSection
        title="Email templates"
        description="Email templates enable you to send personalized messages to your customers. This page provides a list of all your existing templates. To view the contents of a specific email template, click on it."
      >
        <Card>
          <CardContent>
            <DataTable
              title="Email templates"
              columns={columns}
              data={templates}
              header={({ table }) => (
                <EmailTemplatesTableHeader
                  table={table}
                  handleDelete={handleDelete}
                  handleRefetch={handleRefetch}
                />
              )}
            />
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};

interface EmailTemplatesTableHeaderProps {
  table: Table<IBESEmailTemplate>;
  handleDelete: (rows: IBESEmailTemplate[]) => void;
  handleRefetch: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const EmailTemplatesTableHeader = ({
  table,
  handleDelete,
  handleRefetch,
}: EmailTemplatesTableHeaderProps) => (
  <div className="flex items-center justify-end gap-4">
    <Button
      size="sm"
      variant="destructive-outline"
      onClick={() =>
        handleDelete(
          table.getSelectedRowModel().rows.map((row) => row.original),
        )
      }
    >
      Delete
    </Button>
    <Button
      name="Refresh email templates"
      size="sm"
      variant="outline"
      onClick={handleRefetch}
    >
      <RotateCw size={16} className="text-muted-foreground" />
    </Button>
    <Link
      to={besPaths.CREATE_NEW_EMAIL_TEMPLATE}
      className={buttonVariants({
        size: 'sm',
        variant: 'secondary',
      })}
    >
      Create template
    </Link>
  </div>
);

export default EmailTemplates;
