import React from 'react';
import { useFemails, useFemailsState } from '../femails-provider';

const BlocksNode = ({ id }: { id: string }) => {
  const { femails } = useFemails();
  const instance = useFemailsState(`nodes.instances.${id}`);
  const { type } = instance || {};
  const node = femails.nodes.get(type);

  if (!node || !node.render) {
    return <div className="h-max w-full bg-muted">No node found</div>;
  }

  return <div className="h-max w-full m-4">{node.render(instance)}</div>;
};

export const Blocks = React.memo(BlocksNode);
