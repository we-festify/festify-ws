import { EditorLayout } from './components/editor-layout';
import EditorHeader from './components/editor-layout/header';
import EditorNav from './components/editor-nav/editor-nav';
import EditorSideNav from './components/editors-side-nav/editor-side-nav';

const EmailEditor = () => {
  return (
    <>
      <EditorLayout>
        <EditorHeader>
          <EditorNav />
        </EditorHeader>
        <EditorSideNav />
      </EditorLayout>
    </>
  );
};

export default EmailEditor;
