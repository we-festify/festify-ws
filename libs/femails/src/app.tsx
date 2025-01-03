import { TextBlockPlugin } from '@femails/blocks';
import EditorComponent from '@femails/components/editor';
import { Editor } from '@femails/core/editor';
import { PluginRegistry } from '@femails/core/plugins/registry';

const registry = new PluginRegistry();
registry.register([new TextBlockPlugin()]);
const editor = new Editor(registry);

const App = () => {
  return <EditorComponent editor={editor} />;
};

export default App;
