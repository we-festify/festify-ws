import { IFemailsCommandsManager } from '@/types/commands';
import { IFemailsCommonsManager } from '@/types/commons';
import { FemailsCommandsManager } from './commands';

export const TEXT_COMMAND = 'TEXT';

export class FemailsCommonsManager implements IFemailsCommonsManager {
  readonly commands: IFemailsCommandsManager;

  constructor() {
    this.commands = new FemailsCommandsManager();

    this.commands.add({
      id: TEXT_COMMAND,
      name: 'Text',
      description:
        'Command to convert a value to text. Run by default before any text rendering',
      run: (value) => `${value}`,
    });
  }

  text: (value: string | number) => string = (value) => {
    const textCommand = this.commands.get(TEXT_COMMAND);
    if (textCommand) {
      return textCommand.run(value) as string;
    }
    return '';
  };
}
