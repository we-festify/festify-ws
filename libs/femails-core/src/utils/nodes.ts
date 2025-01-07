import {
  IFemailsNode,
  IFemailsNodeAttribute,
  IFemailsNodeAttributeValue,
  IFemailsNodeInstance,
  IFemailsNodesManager,
} from '@/types/nodes';

export class FemailsNodesManager implements IFemailsNodesManager {
  private readonly nodes: Readonly<Map<string, IFemailsNode>>;
  readonly instances: Map<string, IFemailsNodeInstance>;

  constructor() {
    this.nodes = new Map();
    this.instances = new Map();
  }

  register: (node: IFemailsNode) => void = (node) => {
    if (this.nodes.has(node.type)) {
      throw new Error(
        `Node with type "${node.type}" already exists. If you want to override it, use the "override" method instead.`,
      );
    }

    this.nodes.set(node.type, node);
  };

  override: (node: IFemailsNode) => void = (node) => {
    if (!this.nodes.has(node.type)) {
      throw new Error(
        `Node with type "${node.type}" does not exist. If you want to register it, use the "register" method instead.`,
      );
    }

    this.nodes.set(node.type, node);
  };

  createInstance: (type: string, parent: string) => string = (type, parent) => {
    const node = this.nodes.get(type);
    if (!node) {
      throw new Error(
        `Node with type "${type}" does not exist. Please register it first.`,
      );
    }

    const instance = new FemailsNodeInstance(
      parent,
      type,
      node.name,
      node.attributes,
    );
    this.instances.set(instance.id, instance);
    return instance.id;
  };

  getInstance: (id: string) => IFemailsNodeInstance = (id) => {
    const instance = this.instances.get(id);
    if (!instance) {
      throw new Error(`Node instance with id "${id}" does not exist.`);
    }

    return instance;
  };
}

export class FemailsNodeInstance implements IFemailsNodeInstance {
  readonly id: string;
  readonly type: string;
  name: string;
  attributes: Record<string, IFemailsNodeAttributeValue>;
  parent: string;
  children: string[] = [];

  constructor(
    parent: string,
    type: string,
    name: string,
    attributes: Readonly<Record<string, IFemailsNodeAttribute>>,
  ) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.name = name;
    this.attributes = {};
    Object.entries(attributes).forEach(([key, attr]) => {
      this.attributes[key] = attr.defaultValue;
    });
    this.parent = parent;
  }

  readonly set: (attribute: string, value: string | number | boolean) => void =
    (attribute, value) => {
      if (Object.keys(this.attributes).indexOf(attribute) === -1) {
        throw new Error(
          `Attribute "${attribute}" does not exist on node "${this.type}".`,
        );
      }

      this.attributes[attribute] = value;
    };
}
