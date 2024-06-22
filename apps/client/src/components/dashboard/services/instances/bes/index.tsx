import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs';
import InstanceDetails from '../shared/InstanceDetails';
import EmailTemplates from './EmailTemplates';

const BESInstanceIndex = () => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <div className="w-full sticky top-10 bg-background z-10 pb-2 mb-2 pt-4">
        <TabsList className="grid w-max grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="details">
        <InstanceDetails />
      </TabsContent>
      <TabsContent value="templates">
        <EmailTemplates />
      </TabsContent>
    </Tabs>
  );
};

export default BESInstanceIndex;
