import { FemailsCommand, IFemailsCommandsManager } from '@/types/commands';

export class FemailsCommandsManager implements IFemailsCommandsManager {
  private readonly commands: Map<string, FemailsCommand>;

  constructor() {
    this.commands = new Map<string, FemailsCommand>();
  }

  add(command: FemailsCommand): void {
    this.commands.set(command.id, command);
  }

  remove(id: string): void {
    this.commands.delete(id);
  }

  get(id: string): FemailsCommand | undefined {
    const command = this.commands.get(id);
    return command;
  }
}
