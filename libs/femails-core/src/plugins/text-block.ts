import { EXPORT_HTML_COMMAND } from '@/constants/commands';
import { NODE_ATTRIBUTE_TYPE, TEXT_BLOCK_NODE_TYPE } from '@/constants/nodes';
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
    this.initTextNode(femails);
    this.registerExportHTMLCommand(femails);
    console.log('Text Block Plugin initialized');
  }

  private initTextNode(femails: Readonly<IFemails>): void {
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

  private registerExportHTMLCommand(femails: Readonly<IFemails>): void {
    femails.commands.add({
      id: `${TEXT_BLOCK_NODE_TYPE}_${EXPORT_HTML_COMMAND}`,
      name: 'Export HTML',
      description: 'Export the node as HTML',
      run: (nodeId: unknown) => {
        const node = femails.nodes.getInstance(nodeId as string);
        if (!node) return '';

        let html = '';
        if (TEXT_BLOCK_NODE_TYPE === node.type) {
          html = `<p>${node.attributes.content}</p>`;
        }
        return html;
      },
    });
  }
}
