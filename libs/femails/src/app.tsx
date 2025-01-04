import { TextBlockPlugin } from '@femails/blocks';
import EditorComponent from '@femails/components/editor';
import { Editor } from '@femails/core/editor';

const editor = new Editor();
editor.registry.register(new TextBlockPlugin());

const App = () => {
  return <EditorComponent editor={editor} />;
};

export default App;
