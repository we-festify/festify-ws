import { EXPORT_HTML_COMMAND } from '@/constants/commands';
import { TEMPLATE_BLOCK_NODE_TYPE } from '@/constants/nodes';
import { IFemails } from '@/types/femails';
import { IFemailsPlugin } from '@/types/plugins';

export class TemplateBlockPlugin implements IFemailsPlugin {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  constructor() {
    this.id = 'TEMPLATE_BLOCK';
    this.name = 'Template Block';
    this.description = 'A simple template block plugin. This is root node.';
  }

  init(femails: Readonly<IFemails>): void {
    this.initTemplateNode(femails);
    this.registerExportHTMLCommand(femails);
    console.log('Template Block Plugin initialized');
  }

  private initTemplateNode(femails: Readonly<IFemails>): void {
    femails.nodes.register({
      type: TEMPLATE_BLOCK_NODE_TYPE,
      name: 'Template',
      description: 'A simple template block',
      attributes: {},
      meta: {
        areChildrenAllowed: true,
      },
    });
  }

  private registerExportHTMLCommand(femails: Readonly<IFemails>): void {
    femails.commands.add({
      id: `${TEMPLATE_BLOCK_NODE_TYPE}_${EXPORT_HTML_COMMAND}`,
      name: 'Export HTML',
      description: 'Export the node as HTML',
      run: (nodeId: unknown) => {
        const node = femails.nodes.getInstance(nodeId as string);
        if (!node) return '';

        let html = '';
        if (TEMPLATE_BLOCK_NODE_TYPE === node.type) {
          const exportHTMLCommand = femails.commands.get(EXPORT_HTML_COMMAND);

          html = `
<html>
  <head>
    <title>Template Block</title>
  </head>
  <body>
    ${node.children.map((childId) => exportHTMLCommand?.run(childId)).join('')}
  </body>
</html>`;
        }
        return html.trim();
      },
    });
  }
}
