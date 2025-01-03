import { IBlockPluginCore } from '@femails/types/plugins';
import { IBlock } from '@femails/types/blocks';

export class TextBlockPluginCore implements IBlockPluginCore {
  readonly category: 'block';
  readonly id: 'block-text';
  readonly name: 'Text';
  readonly description?: string;

  constructor() {
    this.category = 'block';
    this.id = 'block-text';
    this.name = 'Text';
    this.description = 'A simple text block';
  }

  init() {}

  toHTML(block: IBlock, superToHTML: (b: IBlock) => string): string {
    if (typeof block.children === 'string') {
      return `<p>${block.children}</p>`;
    }

    return `<p>${block.children
      ?.map((child) => superToHTML(child))
      .join('')}</p>`;
  }
}
