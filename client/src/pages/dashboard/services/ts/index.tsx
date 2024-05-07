import ServiceHeader from "@/components/dashboard/services/ServiceHeader";
import ServiceLayout from "../layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceDocs from "@/components/dashboard/services/ServiceDocs";
import { useGetServiceMetaByTypeQuery } from "@/api/services";

const TSService = () => {
  const { data: { service = {} } = {} } = useGetServiceMetaByTypeQuery("ts");

  return (
    <ServiceLayout>
      <ServiceHeader type="ts" />
      {service.enabled ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-max grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="instances">Instances</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-8">
            Overview
          </TabsContent>
          <TabsContent value="instances" className="mt-8">
            Instances
          </TabsContent>
          <TabsContent value="docs" className="mt-8">
            <ServiceDocs type="ts" />
          </TabsContent>
        </Tabs>
      ) : (
        <ServiceDocs type="ts" />
      )}
    </ServiceLayout>
  );
};

export default TSService;
