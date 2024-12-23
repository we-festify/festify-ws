import useSearchParamState from '@sharedui/hooks/useSearchParamState';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sharedui/primitives/tabs';
import { ChartSpline, Database as DatabaseIcon } from 'lucide-react';
import Charts from './charts';
import Database from './database';

const ActionTabs = () => {
  const [activeTab, setActiveTab] = useSearchParamState('action-tab');

  return (
    <Tabs
      defaultValue="database"
      className="w-full"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList>
        <TabsTrigger value="database">
          <DatabaseIcon size={16} />
        </TabsTrigger>
        <TabsTrigger value="charts">
          <ChartSpline size={16} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="database">
        <Database />
      </TabsContent>
      <TabsContent value="charts">
        <Charts />
      </TabsContent>
    </Tabs>
  );
};

export default ActionTabs;
