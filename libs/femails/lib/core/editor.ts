import { IEditor } from '@femails/types/editor';
import { IPluginRegistry } from '@femails/types/plugins';

export class Editor implements IEditor {
  readonly registry: IPluginRegistry;

  constructor(registry: IPluginRegistry) {
    this.registry = registry;
  }
}
