import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { createUserSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { aimPaths } from '@sharedui/constants/paths';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import PageSection from '@sharedui/components/page-section';
import { Form } from '@sharedui/primitives/form';
import { Card, CardContent } from '@sharedui/primitives/card';
import { Button } from '@sharedui/primitives/button';
import UserForm from '@aim-ui/components/users/user-form';
import {
  useReadManagedUserQuery,
  useUpdateManagedUserMutation,
} from '@aim-ui/api/users';
import { useAuth } from '@rootui/providers/auth-provider';
import { generateFRN } from '@sharedui/utils/frn';
import { LoadingButton } from '@sharedui/components/loading-button';

const UpdateUserPage = () => {
  const { alias } = useParams<{ alias: string }>();
  const { user } = useAuth();
  const frn = generateFRN('aim', user?.accountId ?? '', 'user', alias ?? '');
  const { data: { user: managedUser } = {} } = useReadManagedUserQuery(frn);
  const form = useForm<z.infer<typeof createUserSchema>>({
    defaultValues: managedUser,
    resolver: zodResolver(createUserSchema),
  });
  const navigate = useNavigate();
  const [updateManagedUser, { isLoading }] = useUpdateManagedUserMutation();

  const handleUpdateUser = async (values: z.infer<typeof createUserSchema>) => {
    try {
      await updateManagedUser({
        frn,
        user: {
          alias: values.alias,
          password: values.password,
        },
      }).unwrap();
      toast.success('User updated successfully');
      form.reset();
      navigate(aimPaths.USERS, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8 m-auto max-w-[1024px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateUser)}>
          <PageSection
            title="Update user"
            description="Users are identities with long-term credentials that are used to interact with FWS in an account."
          >
            <Card>
              <CardContent>
                <UserForm form={form} />
              </CardContent>
            </Card>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(aimPaths.USERS, { replace: true });
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="secondary"
                size="sm"
                type="submit"
                loading={isLoading}
              >
                Update user
              </LoadingButton>
            </div>
          </PageSection>
        </form>
      </Form>
    </div>
  );
};

export default UpdateUserPage;
