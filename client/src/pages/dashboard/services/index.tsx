import { Separator } from "@/components/ui/separator";
import ServicesGrid from "@/components/dashboard/services/ServicesGrid";

const Services = () => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium">Services</h3>
        <p className="text-sm text-muted-foreground">
          Search for all the services you need.
        </p>
      </div>
      <Separator />
      <ServicesGrid />
    </div>
  );
};

export default Services;
