import { createContext, useContext } from 'react';

interface IEditorContext {
  value: string;
  onChange: (value: string) => void;
}

export const EditorContext = createContext<IEditorContext | undefined>(
  undefined,
);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
