import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sharedui/primitives/tabs';
import {
  ChartSpline,
  Database as DatabaseIcon,
  Filter,
  Settings2,
} from 'lucide-react';
import Charts from './charts';
import Fields from './fields';
import OptionConfig from './option-config';
import { useCanvas } from '../canvas/provider';
import Filters from './filters';

const ActionTabs = () => {
  const {
    activeTileId,
    clearActiveTileId,
    activeActionTab,
    setActiveActionTab,
  } = useCanvas();

  return (
    <Tabs
      defaultValue="database"
      className="w-full"
      value={activeActionTab}
      onValueChange={(value) => {
        setActiveActionTab(value);
        clearActiveTileId();
      }}
    >
      <TabsList>
        <TabsTrigger value="database">
          <DatabaseIcon size={16} />
        </TabsTrigger>
        <TabsTrigger value="charts">
          <ChartSpline size={16} />
        </TabsTrigger>
        {activeTileId && activeActionTab === 'config' && (
          <TabsTrigger value="config">
            <Settings2 size={16} />
          </TabsTrigger>
        )}
        {activeTileId && activeActionTab === 'filters' && (
          <TabsTrigger value="filters">
            <Filter size={16} />
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="database">
        <Fields />
      </TabsContent>
      <TabsContent value="charts">
        <Charts />
      </TabsContent>
      {activeTileId && activeActionTab === 'config' && (
        <TabsContent value="config">
          <OptionConfig />
        </TabsContent>
      )}
      {activeTileId && activeActionTab === 'filters' && (
        <TabsContent value="filters">
          <Filters />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ActionTabs;
