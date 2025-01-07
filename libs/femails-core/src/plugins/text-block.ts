import { NODE_ATTRIBUTE_TYPE } from '@/constants/nodes';
import { IFemails } from '@/types/femails';
import { IFemailsPlugin } from '@/types/plugins';

export const TEXT_BLOCK_NODE_TYPE = 'TEXT_BLOCK_NODE';

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
    this.initTextNode(femails);
    console.log('Text Block Plugin initialized', femails);
  }

  initTextNode(femails: Readonly<IFemails>): void {
    femails.nodes.register({
      type: TEXT_BLOCK_NODE_TYPE,
      name: 'Text',
      description: 'A simple text block',
      attributes: {
        content: {
          type: NODE_ATTRIBUTE_TYPE.STRING,
          name: 'Content',
          description: 'The content of the text block',
          defaultValue: '',
        },
      },
    });
  }
}
