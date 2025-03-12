import { EXPORT_HTML_COMMAND } from '@/constants/commands';
import { IFemails } from '@/types/femails';
import { IFemailsPlugin } from '@/types/plugins';

export class ExportHTMLPlugin implements IFemailsPlugin {
  id: string;
  name: string;
  description: string;

  constructor() {
    this.id = 'EXPORT_HTML';
    this.name = 'Export HTML';
    this.description = 'Export the node as HTML';
  }

  init: (femails: Readonly<IFemails>) => void = (femails) => {
    femails.commands.add({
      id: EXPORT_HTML_COMMAND,
      name: 'Export HTML',
      description: 'Export the node as HTML',
      run: (nodeId: unknown) => {
        const node = femails.nodes.getInstance(nodeId as string);
        if (!node) return '';

        const registeredNodeTypes = femails.nodes.getTypes();
        let html = '';
        if (registeredNodeTypes.includes(node.type)) {
          const commandId = `${node.type}_${EXPORT_HTML_COMMAND}`;
          const command = femails.commands.get(commandId);
          if (command) {
            html = `${command.run(nodeId)}`;
          }
        }
        return html;
      },
    });
  };
}
