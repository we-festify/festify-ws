export type IFemailsNodeAttributeType = 'string' | 'number' | 'boolean';

export type IFemailsNodeAttributeValue = string | number | boolean;

export interface IFemailsNodeAttribute {
  readonly type: IFemailsNodeAttributeType;
  readonly name: string;
  readonly description: string;
  readonly defaultValue: IFemailsNodeAttributeValue;
}

export interface IFemailsNodeInstance {
  readonly id: string;
  readonly type: string;
  name: string;
  readonly attributes: Record<string, IFemailsNodeAttributeValue>;
  parent: string;
  children: string[];

  /**
   * Update the name of the node
   * @param name The new name of the node
   */
  readonly rename: (name: string) => void;
  /**
   * Set a value for an attribute of the node
   * @param attribute The attribute to set the value for
   * @param value The value to set
   */
  readonly set: (attribute: string, value: string | number | boolean) => void;
}

export interface IFemailsNodeMeta {
  readonly areChildrenAllowed: boolean;
}

export interface IFemailsNode {
  readonly type: string;
  readonly name: string;
  readonly description: string;
  readonly attributes?: Readonly<Record<string, IFemailsNodeAttribute>>;
  readonly meta?: Partial<IFemailsNodeMeta>;
}

export interface IFemailsNodesManager {
  /** The list of instances of nodes */
  readonly instances: Record<string, IFemailsNodeInstance>;
  /** The id of the root node */
  readonly root: string;
  /**
   * Register a new node
   * @param node The node to register
   */
  readonly register: (node: IFemailsNode) => void;
  /**
   * Override an existing node
   * @param node The node to override
   */
  readonly override: (node: IFemailsNode) => void;
  /**
   * Get the node with the given type
   * @param type The type of the node to get
   * @returns The node with the given type
   */
  readonly get: (type: string) => IFemailsNode;

  /**
   * Create a new instance of a node
   * @param type The type of the node to create
   * @param parent The parent id of the node
   * @returns The id of the created node
   */
  readonly createInstance: (type: string, parent: string) => string;
  /**
   * Get an instance of a node by its id
   * @param id The id of the node to get
   * @returns The instance of the node
   */
  readonly getInstance: (id: string) => IFemailsNodeInstance;
  /**
   * Get the list of all registered node types
   * @returns The list of all registered node types
   */
  readonly getTypes: () => string[];
}
