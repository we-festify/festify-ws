import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  height?: string;
  defaultValue?: string;
  theme?: 'vs' | 'vs-dark' | 'hc-black';
  onChange?: (value: string) => void;
}

export const CodeEditor = ({
  height = '500px',
  defaultValue = '',
  theme = 'vs',
  onChange,
}: CodeEditorProps) => {
  return (
    <Editor
      height={height ?? '500px'}
      defaultLanguage="javascript"
      defaultValue={defaultValue}
      theme={theme}
      options={{
        scrollBeyondLastLine: false,
      }}
      onChange={(value) => onChange?.(value ?? '')}
    />
  );
};
