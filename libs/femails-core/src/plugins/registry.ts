import {
  IBlockPlugin,
  IPluginRegistry,
  Plugin,
  PluginCategory,
} from '@/types/plugins';

export class PluginRegistry implements IPluginRegistry {
  readonly registry: Map<string, IBlockPlugin>;

  constructor() {
    this.registry = new Map();
  }

  register: (plugins: Plugin | Plugin[]) => void = (plugins) => {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }

    plugins.forEach((p) => {
      if (this.registry.has(p.id)) {
        throw new Error(
          `Plugin with id ${p.id} has already been registered. To register this plugin, you need to deregister it first.`,
        );
      }

      this.registry.set(p.id, p);
    });
  };

  deregister: (id: string) => void = (id) => {
    if (!this.registry.has(id)) {
      throw new Error(
        `Plugin with id ${id} has not been registered. To unregister this plugin, you need to register it first.`,
      );
    }

    this.registry.delete(id);
  };

  get: (id: string) => Plugin = (id) => {
    if (!this.registry.has(id)) {
      throw new Error(
        `Plugin with id ${id} has not been registered. To use this plugin, you need to register it first.`,
      );
    }

    return this.registry.get(id) as Plugin;
  };

  getByCategory: (category: PluginCategory) => Plugin[] = (category) => {
    return Array.from(this.registry.values()).filter(
      (plugin) => plugin.category === category,
    );
  };
}
