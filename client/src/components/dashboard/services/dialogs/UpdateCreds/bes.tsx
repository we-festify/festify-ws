import { useUpdateCredsMutation } from "@/api/instances";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useShowHide from "@/hooks/useShowHide";
import { toast } from "sonner";

const UpdateBESCredsDialogContent = ({
  instanceId,
  defaultValue,
}: {
  instanceId: string;
  defaultValue: any;
}) => {
  const [updateCreds, { isLoading }] = useUpdateCredsMutation();
  const { isVisible: isPasswordVisible, ToggleEye } = useShowHide();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const instanceName = formData.get("instance-name") as string;
    const email = formData.get("sender-email") as string;
    const password = formData.get("sender-password") as string;

    try {
      const payload = await updateCreds({
        serviceType: "bes",
        instanceId: instanceId,
        creds: {
          email,
          password,
          name: instanceName,
        },
      }).unwrap();
      toast.success(payload.message);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="instance-name">Instance Name</Label>
        <Input
          id="instance-name"
          name="instance-name"
          type="text"
          placeholder="Project 1"
          required
          defaultValue={defaultValue?.name}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sender-email">Sender Email</Label>
        <Input
          id="sender-email"
          name="sender-email"
          type="email"
          placeholder="leafpetal@example.com"
          autoComplete="off"
          required
          defaultValue={defaultValue?.email}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sender-password">Sender Password</Label>
        <div className="relative">
          <Input
            id="sender-password"
            name="sender-password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="off"
            required
          />
          <ToggleEye name="password" className="absolute top-0 right-0" />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update"}
      </Button>
    </form>
  );
};

export default UpdateBESCredsDialogContent;
