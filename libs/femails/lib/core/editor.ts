import { IEditor } from '@femails/types/editor';
import { IPluginRegistry } from '@femails/types/plugins';
import { PluginRegistry } from './plugins/registry';

export class Editor implements IEditor {
  readonly registry: IPluginRegistry;

  constructor() {
    this.registry = new PluginRegistry();
  }
}
