import { EditorContext } from './context';
import { IEditor } from '@femails/types/editor';

interface EditorProps {
  editor: IEditor;
}

const EditorComponent = ({ editor }: EditorProps) => {
  console.log(editor);
  return (
    <EditorContext.Provider value={undefined}>
      <div>Editor</div>
    </EditorContext.Provider>
  );
};

export default EditorComponent;
