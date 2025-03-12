import type {
  IFemailsNode as CoreNode,
  IFemailsNodesManager as CoreNodesManager,
  IFemailsNodeInstance,
} from 'femails-core';

export interface IFemailsNode extends CoreNode {
  /**
   * Render the node
   * @returns The rendered node
   */
  render?: (instance: IFemailsNodeInstance) => React.ReactNode;
}

export interface IFemailsNodesManager extends CoreNodesManager {
  instances: Record<string, IFemailsNodeInstance>;

  /**
   * Updates the node with the given type
   * @param type The type of the node to update
   * @param updates The updates to apply
   */
  update: (type: string, updates: Partial<IFemailsNode>) => void;

  /** @override */
  get: (type: string) => IFemailsNode;
}
