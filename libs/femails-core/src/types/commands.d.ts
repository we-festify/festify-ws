export interface FemailsCommand {
  /** Unique identifier of the command */
  readonly id: string;
  /** Name of the command */
  readonly name: string;
  /** Description of the command */
  readonly description: string;
  /** Function that runs the command */
  readonly run: (...args: unknown[]) => unknown;
}

export interface IFemailsCommandsManager {
  /**
   * Add a command to the manager. If a command with the same ID already exists, it will be replaced.
   * @param command The command to add.
   * @param existing The existing command to replace, if exists.
   */
  add(command: FemailsCommand): void;
  /**
   * Remove a command from the manager.
   * @param id The ID of the command to remove.
   */
  remove(id: string): void;
  /**
   * Get a command by its ID.
   * @param id The ID of the command to get.
   * @returns The command with the provided ID, or `undefined` if not found.
   */
  get(id: string): FemailsCommand | undefined;
}
