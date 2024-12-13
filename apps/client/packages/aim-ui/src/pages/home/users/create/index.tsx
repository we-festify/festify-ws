import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { createUserSchema, defaultValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { aimPaths } from '@sharedui/constants/paths';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import PageSection from '@sharedui/components/page-section';
import { Form } from '@sharedui/primitives/form';
import { Card, CardContent } from '@sharedui/primitives/card';
import { Button } from '@sharedui/primitives/button';
import UserForm from '@aim-ui/components/users/user-form';
import { useCreateManagedUserMutation } from '@aim-ui/api/users';
import { LoadingButton } from '@sharedui/components/loading-button';

const CreateUserPage = () => {
  const form = useForm<z.infer<typeof createUserSchema>>({
    defaultValues,
    resolver: zodResolver(createUserSchema),
  });
  const navigate = useNavigate();
  const [createManagedUser, { isLoading }] = useCreateManagedUserMutation();

  const handleCreateUser = async (
    _values: z.infer<typeof createUserSchema>,
  ) => {
    try {
      await createManagedUser(form.getValues()).unwrap();
      toast.success('User created successfully');
      form.reset();
      navigate(aimPaths.USERS, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8 m-auto max-w-[1024px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateUser)}>
          <PageSection
            title="Create user"
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
                Create user
              </LoadingButton>
            </div>
          </PageSection>
        </form>
      </Form>
    </div>
  );
};

export default CreateUserPage;
