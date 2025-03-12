import TextBlock from '@femails-react/components/blocks/text';
import { IFemails } from '@femails-react/types/femails';
import { IFemailsPlugin } from '@femails-react/types/plugins';
import {
  IFemailsNodeInstance,
  TEXT_BLOCK_NODE_TYPE,
  TextBlockPlugin as CoreTextBlockPlugin,
} from 'femails-core';

export class TextBlockPlugin
  extends CoreTextBlockPlugin
  implements IFemailsPlugin
{
  init(femails: Readonly<IFemails>): void {
    super.init(femails);

    femails.nodes.update(TEXT_BLOCK_NODE_TYPE, {
      render: (instance: IFemailsNodeInstance) => {
        return TextBlock({ instance });
      },
    });
  }
}
