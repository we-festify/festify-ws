import { FemailsCommandsManager } from '@/utils/commands';
import { FemailsCommand } from '@/types/commands';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('CommandsManager', () => {
  let commandsManager: FemailsCommandsManager;

  beforeEach(() => {
    commandsManager = new FemailsCommandsManager();
  });

  const sampleCommand: FemailsCommand = {
    id: 'test-command',
    name: 'Test Command',
    description: 'A command for testing purposes',
    run: (...args: unknown[]) => `Received: ${args.join(', ')}`,
  };

  const anotherCommand: FemailsCommand = {
    id: 'another-command',
    name: 'Another Command',
    description: 'Another command for testing',
    run: (...args: unknown[]): number =>
      args.reduce((a: number, b: unknown) => a + (b as number), 0),
  };

  it('should add a command and retrieve it by ID', () => {
    commandsManager.add(sampleCommand);

    const retrieved = commandsManager.get(sampleCommand.id);
    expect(retrieved).toEqual(sampleCommand);
  });

  it('should replace an existing command with the same ID', () => {
    commandsManager.add(sampleCommand);

    const updatedCommand = {
      ...sampleCommand,
      description: 'Updated description',
    };
    commandsManager.add(updatedCommand);

    const retrieved = commandsManager.get(sampleCommand.id);
    expect(retrieved).toEqual(updatedCommand);
  });

  it('should not replace an existing command with a different ID', () => {
    commandsManager.add(sampleCommand);

    const updatedCommand = {
      ...sampleCommand,
      id: 'new-id',
      description: 'Updated description',
    };
    commandsManager.add(updatedCommand);

    const retrieved = commandsManager.get(sampleCommand.id);
    expect(retrieved).toEqual(sampleCommand);
  });

  it('should support nesting commands', () => {
    commandsManager.add(sampleCommand);
    commandsManager.add(anotherCommand);

    const nestedCommand: FemailsCommand = {
      id: 'nested-command',
      name: 'Nested Command',
      description: 'A command that runs other commands',
      run: () => {
        const command1 = commandsManager.get(sampleCommand.id);
        const command2 = commandsManager.get(anotherCommand.id);

        if (!command1 || !command2) {
          return 'Error';
        }

        return `${command1.run('nested')} - ${command2.run(1, 2, 3)}`;
      },
    };
    commandsManager.add(nestedCommand);

    const retrievedNested = commandsManager.get(nestedCommand.id);
    if (!retrievedNested) {
      throw new Error('Nested command not found');
    }

    const result = retrievedNested.run();
    expect(result).toBe('Received: nested - 6');
  });

  it('should support replacing a command with nested command', () => {
    commandsManager.add(sampleCommand);

    const existingRun = commandsManager.get(sampleCommand.id)?.run;
    const nestedCommand: FemailsCommand = {
      id: sampleCommand.id,
      name: 'Nested Command',
      description:
        'A command that replaces the existing command with a nested one',
      run: () => {
        if (!existingRun) {
          return 'Error';
        }
        return `Nested: ${existingRun('nested')}`;
      },
    };
    commandsManager.add(nestedCommand);

    const retrievedNested = commandsManager.get(sampleCommand.id);
    expect(retrievedNested).toEqual(nestedCommand);

    const result = retrievedNested?.run();
    expect(result).toBe('Nested: Received: nested');
  });

  it('should remove a command by ID', () => {
    commandsManager.add(sampleCommand);
    commandsManager.remove(sampleCommand.id);

    const retrieved = commandsManager.get(sampleCommand.id);
    expect(retrieved).toBeUndefined();
  });

  it('should return undefined for a non-existent command ID', () => {
    const retrieved = commandsManager.get('non-existent-id');
    expect(retrieved).toBeUndefined();
  });

  it('should correctly handle multiple commands', () => {
    commandsManager.add(sampleCommand);
    commandsManager.add(anotherCommand);

    const retrievedSample = commandsManager.get(sampleCommand.id);
    const retrievedAnother = commandsManager.get(anotherCommand.id);

    expect(retrievedSample).toEqual(sampleCommand);
    expect(retrievedAnother).toEqual(anotherCommand);
  });

  it('should allow executing the "run" function of a retrieved command with arguments', () => {
    commandsManager.add(sampleCommand);
    commandsManager.add(anotherCommand);

    const command1 = commandsManager.get(sampleCommand.id);
    const command2 = commandsManager.get(anotherCommand.id);

    if (!command1 || !command2) {
      throw new Error('Commands not found');
    }

    const result1 = command1.run('arg1', 'arg2');
    const result2 = command2.run(1, 2, 3);

    expect(result1).toBe('Received: arg1, arg2');
    expect(result2).toBe(6);
  });

  it('should handle adding and removing commands in sequence', () => {
    commandsManager.add(sampleCommand);
    commandsManager.add(anotherCommand);

    commandsManager.remove(sampleCommand.id);

    const retrievedSample = commandsManager.get(sampleCommand.id);
    const retrievedAnother = commandsManager.get(anotherCommand.id);

    expect(retrievedSample).toBeUndefined();
    expect(retrievedAnother).toEqual(anotherCommand);
  });
});
