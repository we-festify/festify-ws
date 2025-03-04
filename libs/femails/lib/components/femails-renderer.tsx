import { Blocks } from './blocks';
import { useFemailsState } from './femails-provider';

export const FemailsRenderer = () => {
  const rootId = useFemailsState('nodes.root');

  return (
    <div className="h-max w-full bg-muted">
      <Blocks id={rootId} />
    </div>
  );
};
