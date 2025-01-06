import { IFemailsCommandsManager } from './types/commands';
import { IFemailsCommonsManager } from './types/commons';
import { IFemailsEventsManager } from './types/events';
import { IFemails } from './types/femails';
import { IFemailsPlugin } from './types/plugins';
import { FemailsCommandsManager } from './utils/commands';
import { FemailsCommonsManager } from './utils/commons';
import { FemailsEventsManager } from './utils/events';

export class Femails implements IFemails {
  events: IFemailsEventsManager;
  plugins: IFemailsPlugin[];
  commands: IFemailsCommandsManager;
  commons: IFemailsCommonsManager;

  constructor() {
    this.events = new FemailsEventsManager();
    this.plugins = [];
    this.commands = new FemailsCommandsManager();
    this.commons = new FemailsCommonsManager();
  }

  init(plugins: IFemailsPlugin | IFemailsPlugin[]): void {
    if (Array.isArray(plugins)) {
      this.plugins = plugins;
    } else {
      this.plugins.push(plugins);
    }

    this.plugins.forEach((plugin) => {
      plugin.init(this);
    });
  }
}
