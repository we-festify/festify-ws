import { FemailsNodesManager, FemailsNodeInstance } from '@/utils/nodes';
import {
  IFemailsNode,
  IFemailsNodeAttribute,
  IFemailsNodesManager,
} from '@/types/nodes';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('FemailsNodesManager', () => {
  let nodesManager: IFemailsNodesManager;
  let sampleNode: IFemailsNode;

  beforeEach(() => {
    nodesManager = new FemailsNodesManager();

    sampleNode = {
      type: 'SampleNode',
      name: 'Sample Node',
      description: 'A sample node for testing',
      attributes: {
        text: {
          type: 'string',
          name: 'Text',
          description: 'Text attribute',
          defaultValue: 'default text',
        },
        count: {
          type: 'number',
          name: 'Count',
          description: 'Count attribute',
          defaultValue: 0,
        },
      },
    };
  });

  describe('register', () => {
    it('should register a node successfully', () => {
      nodesManager.register(sampleNode);

      expect(() =>
        nodesManager.createInstance('SampleNode', 'ParentID'),
      ).not.toThrow();
    });

    it('should throw an error if the node type is already registered', () => {
      nodesManager.register(sampleNode);

      expect(() => nodesManager.register(sampleNode)).toThrow(
        `Node with type "SampleNode" already exists. If you want to override it, use the "override" method instead.`,
      );
    });
  });

  describe('override', () => {
    it('should override an existing node successfully', () => {
      nodesManager.register(sampleNode);

      const overriddenNode: IFemailsNode = {
        ...sampleNode,
        description: 'Overridden sample node',
      };

      nodesManager.override(overriddenNode);

      const instanceId = nodesManager.createInstance('SampleNode', 'ParentID');
      const instance = nodesManager.getInstance(instanceId);
      expect(instance.type).toBe('SampleNode');
      expect(instance.name).toBe('Sample Node');
    });

    it('should throw an error if the node type does not exist', () => {
      expect(() => nodesManager.override(sampleNode)).toThrow(
        `Node with type "SampleNode" does not exist. If you want to register it, use the "register" method instead.`,
      );
    });
  });

  describe('createInstance', () => {
    it('should create a new instance of a registered node', () => {
      nodesManager.register(sampleNode);

      const instanceId = nodesManager.createInstance('SampleNode', 'ParentID');
      const instance = nodesManager.getInstance(instanceId);

      expect(instance).toBeInstanceOf(FemailsNodeInstance);
      expect(instance.type).toBe('SampleNode');
      expect(instance.name).toBe('Sample Node');
      expect(instance.parent).toBe('ParentID');
      expect(instance.attributes).toEqual({
        text: 'default text',
        count: 0,
      });
    });

    it('should throw an error if the node type is not registered', () => {
      expect(() =>
        nodesManager.createInstance('UnknownNode', 'ParentID'),
      ).toThrow(
        `Node with type "UnknownNode" does not exist. Please register it first.`,
      );
    });
  });

  describe('getInstance', () => {
    it('should get an instance of a node by its id', () => {
      nodesManager.register(sampleNode);

      const instanceId = nodesManager.createInstance('SampleNode', 'ParentID');
      const instance = nodesManager.getInstance(instanceId);

      expect(nodesManager.getInstance(instanceId)).toBe(instance);
    });

    it('should throw an error if the instance id does not exist', () => {
      expect(() => nodesManager.getInstance('UnknownID')).toThrow(
        `Node instance with id "UnknownID" does not exist.`,
      );
    });
  });
});

describe('FemailsNodeInstance', () => {
  let instance: FemailsNodeInstance;
  let attributes: Record<string, IFemailsNodeAttribute>;

  beforeEach(() => {
    attributes = {
      text: {
        type: 'string',
        name: 'Text',
        description: 'Text attribute',
        defaultValue: 'default text',
      },
      count: {
        type: 'number',
        name: 'Count',
        description: 'Count attribute',
        defaultValue: 0,
      },
    };

    instance = new FemailsNodeInstance(
      'ParentID',
      'SampleNode',
      'Sample Node',
      attributes,
    );
  });

  it('should initialize with default attribute values', () => {
    expect(instance.attributes).toEqual({
      text: 'default text',
      count: 0,
    });
  });

  it('should set a valid attribute value', () => {
    instance.set('text', 'updated text');
    instance.set('count', 42);

    expect(instance.attributes).toEqual({
      text: 'updated text',
      count: 42,
    });
  });

  it('should throw an error when setting an invalid attribute', () => {
    expect(() => instance.set('unknown', 'value')).toThrow(
      `Attribute "unknown" does not exist on node "SampleNode".`,
    );
  });

  it('should have the correct parent and children properties', () => {
    expect(instance.parent).toBe('ParentID');
    expect(instance.children).toEqual([]);
  });
});
