import { EditorLayout } from './components/editor-layout';
import EditorHeader from './components/editor-layout/header';
import EditorNav from './components/editor/nav';
import EditorLeftSideNav from './components/editor/leftSideNav';
import EditorRightSideNav from './components/editor/rightSideNav';
import Playground from './components/editor/playground';

const EmailEditor = () => {
  return (
    <>
      <EditorLayout>
        <EditorHeader>
          <EditorNav />
        </EditorHeader>
        <EditorLeftSideNav />
        <Playground />
        <EditorRightSideNav />
      </EditorLayout>
    </>
  );
};

export default EmailEditor;
