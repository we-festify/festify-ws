import {
  IFemailsNode,
  IFemailsNodeAttribute,
  IFemailsNodeAttributeValue,
  IFemailsNodeInstance,
  IFemailsNodesManager,
} from '@/types/nodes';

export class FemailsNodesManager implements IFemailsNodesManager {
  private readonly nodes: Record<string, IFemailsNode>;
  readonly instances: Record<string, IFemailsNodeInstance>;
  root: string;

  constructor() {
    this.nodes = {};
    this.instances = {};
    this.root = '';
  }

  register: (node: IFemailsNode) => void = (node) => {
    if (this.nodes[node.type]) {
      throw new Error(
        `Node with type "${node.type}" already exists. If you want to override it, use the "override" method instead.`,
      );
    }

    this.nodes[node.type] = node;
  };

  override: (node: IFemailsNode) => void = (node) => {
    if (!this.nodes[node.type]) {
      throw new Error(
        `Node with type "${node.type}" does not exist. If you want to register it, use the "register" method instead.`,
      );
    }

    this.nodes[node.type] = node;
  };

  get: (type: string) => IFemailsNode = (type) => {
    const node = this.nodes[type];
    if (!node) {
      throw new Error(`Node with type "${type}" does not exist.`);
    }

    return node;
  };

  createInstance: (type: string, parent: string) => string = (type, parent) => {
    const node = this.nodes[type];
    if (!node) {
      throw new Error(
        `Node with type "${type}" does not exist. Please register it first.`,
      );
    }

    const instance = new FemailsNodeInstance(
      parent,
      type,
      node.name,
      node?.attributes ?? {},
    );
    this.instances[instance.id] = instance;

    const parentNode =
      this.instances[parent] ?? this.instances[this.root] ?? null;
    if (!parentNode) {
      this.root = instance.id;
    } else {
      const nodeMeta = this.nodes[parentNode.type]?.meta;
      if (nodeMeta?.areChildrenAllowed === true) {
        parentNode.children.push(instance.id);
      }
    }
    return instance.id;
  };

  getInstance: (id: string) => IFemailsNodeInstance = (id) => {
    const instance = this.instances[id];
    if (!instance) {
      throw new Error(`Node instance with id "${id}" does not exist.`);
    }

    return instance;
  };

  getTypes: () => string[] = () => {
    return Array.from(Object.keys(this.nodes));
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

  readonly rename: (name: string) => void = (name) => {
    if (!name) {
      throw new Error('Name cannot be empty.');
    }
    this.name = name;
  };

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
