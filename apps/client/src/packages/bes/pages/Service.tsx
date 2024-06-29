import ServiceHeader from '../../../components/dashboard/services/ServiceHeader';
import ServiceLayout from '../../shared/components/ServiceLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/ui/tabs';
import ServiceDocs from '../../shared/components/ServiceDocs';
import ServiceOverview from '../components/ServiceOverview';
import { useGetServiceMetaByTypeQuery } from '../../../api/services';
import ServiceInstances from '../../shared/components/ServiceInstances';
import APISandbox from '../components/APISandbox';

const BESService = () => {
  const { data: { service = {} } = {} } = useGetServiceMetaByTypeQuery('bes');

  return (
    <ServiceLayout>
      <ServiceHeader type="bes" />
      {service.enabled ? (
        <Tabs defaultValue="overview" className="w-full pb-4">
          <TabsList className="grid w-max grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="instances">Instances</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
            <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
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
          <TabsContent value="sandbox" className="mt-8">
            <APISandbox />
          </TabsContent>
        </Tabs>
      ) : (
        <ServiceDocs type="bes" />
      )}
    </ServiceLayout>
  );
};

export default BESService;
