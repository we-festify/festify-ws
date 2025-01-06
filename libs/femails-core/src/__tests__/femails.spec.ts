import { FemailsEventsManager } from '@/utils/events';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IFemails } from '@/types/femails';
import { Femails } from '@/femails';
import { IFemailsPlugin } from '@/types/plugins';
import { FemailsCommandsManager } from '@/utils/commands';
import { FemailsCommonsManager } from '@/utils/commons';

describe('Femails', () => {
  let femails: IFemails;

  beforeEach(() => {
    femails = new Femails();
  });

  it('should have `events` as an instance of FemailsEventsManager', () => {
    expect(femails.events).toBeInstanceOf(FemailsEventsManager);
  });

  it('should have `plugins` as an empty array', () => {
    expect(femails.plugins).toEqual([]);
  });

  it('should have `commands` as an instance of CommandsManager', () => {
    expect(femails.commands).toBeInstanceOf(FemailsCommandsManager);
  });

  it('should have `commons` as an instance of FemailsCommonsManager', () => {
    expect(femails.commons).toBeInstanceOf(FemailsCommonsManager);
  });

  describe('init', () => {
    it('should add a plugin to the `plugins` array', () => {
      const plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        init: jest.fn(),
      } as IFemailsPlugin;

      femails.init(plugin);

      expect(femails.plugins).toContain(plugin);
    });

    it('should add multiple plugins to the `plugins` array', () => {
      const plugin1 = {
        id: 'test-plugin-1',
        name: 'Test Plugin 1',
        description: 'A test plugin 1',
        init: jest.fn(),
      } as IFemailsPlugin;
      const plugin2 = {
        id: 'test-plugin-2',
        name: 'Test Plugin 2',
        description: 'A test plugin 2',
        init: jest.fn(),
      } as IFemailsPlugin;

      femails.init([plugin1, plugin2]);

      expect(femails.plugins).toContain(plugin1);
      expect(femails.plugins).toContain(plugin2);
    });

    it('should call the `init` method of each plugin', () => {
      const plugin1 = {
        id: 'test-plugin-1',
        name: 'Test Plugin 1',
        description: 'A test plugin 1',
        init: jest.fn(),
      } as IFemailsPlugin;
      const plugin2 = {
        id: 'test-plugin-2',
        name: 'Test Plugin 2',
        description: 'A test plugin 2',
        init: jest.fn(),
      } as IFemailsPlugin;

      femails.init([plugin1, plugin2]);

      expect(plugin1.init).toHaveBeenCalledTimes(1);
      expect(plugin2.init).toHaveBeenCalledTimes(1);
    });

    it('should call the `init` method of plugin with global `femails` instance', () => {
      const plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        description: 'A test plugin',
        init: jest.fn(),
      } as IFemailsPlugin;

      femails.init(plugin);

      expect(plugin.init).toHaveBeenCalledWith(femails);
    });
  });
});
