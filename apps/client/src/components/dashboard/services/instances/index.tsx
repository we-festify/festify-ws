import { useParams } from 'react-router-dom';
import BESInstanceIndex from './bes';

type InstanceIndexMappingType = Record<string, React.FC>;

const InstanceIndexMapping: InstanceIndexMappingType = {
  bes: BESInstanceIndex,
};

const InstanceIndex = () => {
  const params = useParams<{ type: string }>();
  const { type = '' } = params;
  const Component = InstanceIndexMapping[type];

  if (!Component) return null;

  return <Component />;
};

export default InstanceIndex;
