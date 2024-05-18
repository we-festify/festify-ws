import ServiceHeader from "@/components/dashboard/services/ServiceHeader";
import ServiceLayout from "../layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceDocs from "@/components/dashboard/services/ServiceDocs";
import ServiceOverview from "@/components/dashboard/services/ServiceOverview";
import { useGetServiceMetaByTypeQuery } from "@/api/services";
import ServiceInstances from "@/components/dashboard/services/ServiceInstances";

const BESService = () => {
  const { data: { service = {} } = {} } = useGetServiceMetaByTypeQuery("bes");

  return (
    <ServiceLayout>
      <ServiceHeader type="bes" />
      {service.enabled ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-max grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="instances">Instances</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-8">
            <ServiceOverview />
          </TabsContent>
          <TabsContent value="instances" className="mt-8">
            <ServiceInstances type="bes" />
          </TabsContent>
          <TabsContent value="docs" className="mt-8">
            <ServiceDocs type="bes" />
          </TabsContent>
        </Tabs>
      ) : (
        <ServiceDocs type="bes" />
      )}
    </ServiceLayout>
  );
};

export default BESService;
