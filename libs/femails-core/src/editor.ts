import { IEditor } from '@/types/editor';
import { IPluginRegistry } from '@/types/plugins';
import { PluginRegistry } from './plugins/registry';

export class Editor implements IEditor {
  readonly registry: IPluginRegistry;

  constructor() {
    this.registry = new PluginRegistry();
  }
}
