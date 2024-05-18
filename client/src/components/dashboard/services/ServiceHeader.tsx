import {
  useEnableServiceMutation,
  useGetServiceMetaByTypeQuery,
} from "@/api/services";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { BotMessageSquare, Flame, MailCheck } from "lucide-react";
// import React from "react";

interface ServiceHeaderProps {
  type: string;
}

// interface Icons {
//   [key: string]: React.ElementType;
// }

// const icons: Icons = {
//   bes: MailCheck,
//   ts: BotMessageSquare,
//   default: Flame,
// };

const ServiceHeader = ({ type }: ServiceHeaderProps) => {
  const { data: { service = {} } = {} } = useGetServiceMetaByTypeQuery(type);
  const [enableService, { isLoading }] = useEnableServiceMutation();

  const handleEnableService = async () => {
    try {
      const payload = await enableService(type).unwrap();
      toast.success(payload.message);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <div className="flex w-full gap-6 pb-8 pt-4">
      <div className="flex flex-1 flex-col gap-2">
        <h1 className="text-2xl font-semibold">{service.fullName}</h1>
        <p className="text-muted-foreground text-sm">{service.summary}</p>
      </div>
      {!service.enabled ? (
        <Button
          className="w-32 mt-4"
          onClick={handleEnableService}
          disabled={isLoading}
        >
          {isLoading ? "Enabling..." : "Enable"}
        </Button>
      ) : (
        <p className="text-green-500 font-semibold">Enabled</p>
      )}
    </div>
  );
};

export default ServiceHeader;
