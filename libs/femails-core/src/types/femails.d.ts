import { IFemailsCommandsManager } from './commands';
import { IFemailsCommonsManager } from './commons';
import { IFemailsEventsManager } from './events';
import { IFemailsNodesManager } from './nodes';
import { IFemailsPlugin } from './plugins';

export interface IFemails {
  events: IFemailsEventsManager;
  plugins: IFemailsPlugin[];
  commands: IFemailsCommandsManager;
  commons: IFemailsCommonsManager;
  nodes: IFemailsNodesManager;

  /**
   * Initialize the Femails instance with the provided plugins.
   * @param plugins The plugin or plugins to initialize.
   */
  init(plugins: IFemailsPlugin | IFemailsPlugin[]): void;
}
