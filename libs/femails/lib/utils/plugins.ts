import { Plugin } from '@femails/types/plugins';

export const registry = new Map();

/**
 * Register a plugin
 * @param plugin The plugin to register
 */
export const registerPlugin = (plugin: Plugin) => {
  registry.set(plugin.id, plugin);
};

/**
 * Unregister a plugin by its id
 * @param id The id of the plugin to unregister
 * @returns
 * @throws If the plugin with the given id has not been registered
 */
export const unregisterPlugin = (id: string) => {
  if (!registry.has(id)) {
    throw new Error(
      `Plugin with id ${id} has not been registered. To unregister this plugin, you need to register it first.`,
    );
  }

  registry.delete(id);
};

/**
 * Get a plugin by its id
 * @param id The id of the plugin
 * @returns The plugin with the given id
 */
export const getPlugin = (id: string) => {
  if (!registry.has(id)) {
    throw new Error(
      `Plugin with id ${id} has not been registered. To use this plugin, you need to register it first.`,
    );
  }

  return registry.get(id) as Plugin;
};

/**
 * Get all the plugins that match the filter (or all the plugins if no filter is provided)
 * @param filter The filter to apply to the plugins list
 * @returns The list of plugins that match the filter
 */
export const getPlugins = (
  filter: (plugin: Plugin) => boolean = () => true,
) => {
  return Array.from(registry.values()).filter(filter);
};
