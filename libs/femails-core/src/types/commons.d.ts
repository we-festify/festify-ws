import { IFemailsCommandsManager } from './commands';

export interface IFemailsCommonsManager {
  commands: IFemailsCommandsManager;
  /**
   * Converts a value to a string.
   * @param value The value to convert to a string.
   * @returns The string representation of the value.
   */
  readonly text: (value: string | number) => string;
}
