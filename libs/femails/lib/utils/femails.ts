import { IFemails } from '@femails-react/types/femails';
import { IFemailsNodesManager } from '@femails-react/types/nodes';
import { Femails as Core, IFemailsPlugin as CorePlugin } from 'femails-core';
import { FemailsNodesManager } from './nodes';
import { IFemailsPlugin } from '@femails-react/types/plugins';

export class Femails extends Core implements IFemails {
  nodes: IFemailsNodesManager;

  constructor() {
    super();

    this.nodes = new FemailsNodesManager();
    this.plugins = [];
  }

  init(
    plugins: IFemailsPlugin | IFemailsPlugin[] | CorePlugin | CorePlugin[],
  ): void {
    super.init(plugins as CorePlugin[]);
  }
}
