import { createContext, useContext, useMemo, useState } from 'react';
import EditorHeader from './header';
import EditorLeftSidePanel from './leftSidePanel';
import EditorRightSidePanel from './rightSidePanel';

interface EditorLayoutProps {
  children: React.ReactNode;
}

interface EditorLayoutContextProps {
  header: {
    isOpen: boolean;
    height: string;
  };
  setHeader: (value: { isOpen: boolean; height: string }) => void;
  leftSidePanel: {
    isOpen: boolean;
    width: string;
  };
  setLeftSidePanel: (value: { isOpen: boolean; width: string }) => void;
  rightSidePanel: {
    isOpen: boolean;
    width: string;
  };
  setRightSidePanel: (value: { isOpen: boolean; width: string }) => void;
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
  const [leftSidePanel, setLeftSidePanel] = useState({
    isOpen: false,
    width: '0', // tailwindcss width value
  });
  const [rightSidePanel, setRightSidePanel] = useState({
    isOpen: false,
    width: '0', // tailwindcss width value
  });

  const value = useMemo(
    () => ({
      header,
      setHeader,
      leftSidePanel,
      setLeftSidePanel,
      rightSidePanel,
      setRightSidePanel,
    }),
    [
      header,
      setHeader,
      leftSidePanel,
      setLeftSidePanel,
      rightSidePanel,
      setRightSidePanel,
    ],
  );

  return (
    <EditorLayoutContext.Provider value={value}>
      <div className="flex flex-col h-full w-full">{children}</div>
    </EditorLayoutContext.Provider>
  );
};

export {
  EditorLayout,
  EditorHeader,
  EditorLeftSidePanel,
  EditorRightSidePanel,
};
