import { IBlockPlugin } from '@femails/types/plugins';
import { TextBlockPluginCore } from '@femails/core';
import TextIcon from './icon';
import TextComponent from './component';

export class TextBlockPlugin
  extends TextBlockPluginCore
  implements IBlockPlugin
{
  icon: () => JSX.Element;
  render: (props: unknown) => JSX.Element;

  constructor() {
    super();
    this.icon = TextIcon;
    this.render = TextComponent;
  }

  init() {
    super.init();
  }

  setIcon(icon: () => JSX.Element) {
    this.icon = icon;
    return this;
  }

  setRender(render: (props: unknown) => JSX.Element) {
    this.render = render;
    return this;
  }
}
