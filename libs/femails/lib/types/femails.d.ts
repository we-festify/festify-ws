import { IFemails as Core } from 'femails-core';
import { IFemailsNodesManager } from './nodes';
import { IFemailsPlugin } from './plugins';

export interface IFemails extends Core {
  nodes: IFemailsNodesManager;

  init: (plugins: IFemailsPlugin | IFemailsPlugin[]) => void;
}
