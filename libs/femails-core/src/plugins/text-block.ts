import { IFemails } from '@/types/femails';
import { IFemailsPlugin } from '@/types/plugins';

export class TextBlockPlugin implements IFemailsPlugin {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  constructor() {
    this.id = 'TEXT_BLOCK';
    this.name = 'Text Block';
    this.description = 'A simple text block plugin';
  }

  init(femails: Readonly<IFemails>): void {
    console.log('Text Block Plugin initialized', femails);
  }
}
