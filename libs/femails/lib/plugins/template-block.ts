import TemplateBlock from '@femails-react/components/blocks/template';
import { IFemails } from '@femails-react/types/femails';
import {
  TemplateBlockPlugin as CoreTemplateBlockPlugin,
  IFemailsNodeInstance,
  TEMPLATE_BLOCK_NODE_TYPE,
} from 'femails-core';

export class TemplateBlockPlugin extends CoreTemplateBlockPlugin {
  constructor() {
    super();
  }

  init(femails: Readonly<IFemails>): void {
    super.init(femails);

    femails.nodes.update(TEMPLATE_BLOCK_NODE_TYPE, {
      render: (instance: IFemailsNodeInstance) => {
        return TemplateBlock({ instance });
      },
    });
  }
}
