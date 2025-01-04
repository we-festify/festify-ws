import { IBlock } from './blocks';

export type PluginCategory = 'block' | 'feature';

interface IPlugin {
  readonly category: PluginCategory;
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly init: () => void;
}

export interface IBlockPluginCore extends IPlugin {
  category: 'block';
  id: `block-${string}`;
  /**
   * Serialize the block to HTML
   * @param block The block to serialize
   * @param superToHTML The super method to call to serialize the children
   * @returns The HTML string of the block
   */
  toHTML: (
    /** The block to serialize */
    block: IBlock,
    /** The super method to call to serialize the children */
    superToHTML: (b: IBlock) => string,
  ) => string;
}

export interface IBlockPlugin extends IBlockPluginCore {
  /**
   * The icon of the block to display in the editor
   */
  icon: (() => JSX.Element) | null;
  /**
   * Render the block to preview it
   * @param props The props of the block
   * @returns The JSX element of the block
   */
  render: ((props: unknown) => JSX.Element) | null;
}

export type Plugin = IBlockPlugin;

export interface IPluginRegistry {
  readonly registry: Map<string, Plugin>;
  /** Register a plugin */
  register: (plugins: Plugin | Plugin[]) => void;
  /** Deregisters a plugin by its id */
  deregister: (id: string) => void;
  /** Get a plugin by its id */
  get: (id: string) => Plugin;
  /** Get all the plugins that match the category */
  getByCategory: (category: PluginCategory) => Plugin[];
}
