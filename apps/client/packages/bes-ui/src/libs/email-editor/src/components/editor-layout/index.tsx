import { createContext, useContext, useMemo, useState } from 'react';
import EditorHeader from './header';

interface EditorLayoutProps {
  children: React.ReactNode;
}

interface EditorLayoutContextProps {
  header: {
    isOpen: boolean;
    height: string;
  };
  setHeader: (value: { isOpen: boolean; height: string }) => void;
}

const EditorLayoutContext = createContext({} as EditorLayoutContextProps);

// eslint-disable-next-line react-refresh/only-export-components
export const useEditorLayout = () => {
  const context = useContext(EditorLayoutContext);

  if (!context) {
    throw new Error(
      'useEditorLayout must be used within a EditorLayoutProvider',
    );
  }

  return context;
};

const EditorLayout = ({ children }: EditorLayoutProps) => {
  const [header, setHeader] = useState({
    isOpen: false,
    height: '0', // tailwindcss height value
  });

  const value = useMemo(
    () => ({
      header,
      setHeader,
    }),
    [header, setHeader],
  );

  return (
    <EditorLayoutContext.Provider value={value}>
      <div className="flex flex-col h-full w-full">{children}</div>
    </EditorLayoutContext.Provider>
  );
};

export { EditorLayout, EditorHeader };
