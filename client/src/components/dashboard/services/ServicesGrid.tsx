import ServiceCard from "@/components/dashboard/services/ServiceCard";
import { useGetAllServicesMetaQuery } from "@/api/services";

interface Service {
  type: string;
  name: string;
  fullName: string;
  summary: string;
}

const ServicesGrid = () => {
  const { data: { services = [] } = {} } = useGetAllServicesMetaQuery({});

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services?.map((service: Service) => (
        <ServiceCard key={service.type} service={service} />
      ))}
    </div>
  );
};

export default ServicesGrid;
