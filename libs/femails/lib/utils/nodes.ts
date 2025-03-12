import { IFemailsNode, IFemailsNodesManager } from '@femails-react/types/nodes';
import { FemailsNodesManager as CoreNodesManager } from 'femails-core';

export class FemailsNodesManager
  extends CoreNodesManager
  implements IFemailsNodesManager
{
  constructor() {
    super();
  }

  update: (type: string, updates: Partial<IFemailsNode>) => void = (
    type,
    updates,
  ) => {
    const node = this.get(type);
    this.override({ ...node, ...updates });
  };
}
