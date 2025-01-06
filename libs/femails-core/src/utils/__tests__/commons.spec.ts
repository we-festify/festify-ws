import { IFemailsCommonsManager } from '@/types/commons';
import { FemailsCommonsManager, TEXT_COMMAND } from '@/utils/commons';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('FemailsCommonsManager', () => {
  let commonsManager: IFemailsCommonsManager;

  beforeEach(() => {
    commonsManager = new FemailsCommonsManager();
  });

  describe('text', () => {
    it('should convert a string value to text using the TEXT command', () => {
      const result = commonsManager.text('Hello');
      expect(result).toBe('Hello');
    });

    it('should convert a number value to text using the TEXT command', () => {
      const result = commonsManager.text(42);
      expect(result).toBe('42');
    });

    it('should return an empty string if the TEXT command is removed', () => {
      // Simulate removal of the TEXT command
      commonsManager.commands.remove(TEXT_COMMAND);

      const result = commonsManager.text('Fallback');
      expect(result).toBe('');
    });

    it('should be altered if the TEXT command is replaced', () => {
      // Simulate replacement of the TEXT command
      commonsManager.commands.add({
        id: TEXT_COMMAND,
        name: 'Text',
        description: 'A custom text command',
        run: (value) => `Custom: ${value}`,
      });

      const result = commonsManager.text('Hello');
      expect(result).toBe('Custom: Hello');
    });

    it('should handle null and undefined gracefully', () => {
      const nullResult = commonsManager.text(null as unknown as string);
      const undefinedResult = commonsManager.text(
        undefined as unknown as string,
      );

      expect(nullResult).toBe('null');
      expect(undefinedResult).toBe('undefined');
    });
  });
});
