import { createContext, useContext, useMemo, useState } from 'react';

import PageContent from './content';
import PageHeader from './header';
import PageSideNav from './side-nav';
import PageSecondaryNav from './secondary-nav';

interface PageLayoutProps {
  children: React.ReactNode;
}

interface PageLayoutContextProps {
  sideNavBar: {
    isOpen: boolean;
    width: string;
  };
  setSideNavBar: (value: { isOpen: boolean; width: string }) => void;
  pageNavBar: {
    isOpen: boolean;
    width: string;
  };
  setPageNavBar: (value: { isOpen: boolean; width: string }) => void;
  header: {
    isOpen: boolean;
    height: string;
  };
  setHeader: (value: { isOpen: boolean; height: string }) => void;

  openSecondaryNav: () => void;
  closeSecondaryNav: () => void;
  openSideNav: () => void;
  closeSideNav: () => void;
}

const DocsLayoutContext = createContext({} as PageLayoutContextProps);

// eslint-disable-next-line react-refresh/only-export-components
export const usePageLayout = () => {
  const context = useContext(DocsLayoutContext);

  if (!context) {
    throw new Error('usePageLayout must be used within a PageLayoutProvider');
  }

  return context;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  const [sideNavBar, setSideNavBar] = useState({
    isOpen: false,
    width: '0', // tailwindcss width value
  });
  const [pageNavBar, setPageNavBar] = useState({
    isOpen: false,
    width: '0', // tailwindcss width value
  });
  const [header, setHeader] = useState({
    isOpen: false,
    height: '0', // tailwindcss height value
  });

  const value = useMemo(
    () => ({
      sideNavBar,
      setSideNavBar,
      pageNavBar,
      setPageNavBar,
      header,
      setHeader,
      openSecondaryNav: () => {
        setPageNavBar((prev) => ({
          ...prev,
          isOpen: true,
          width: '72',
        }));
      },
      closeSecondaryNav: () => {
        setPageNavBar({
          ...pageNavBar,
          isOpen: false,
        });
      },
      openSideNav: () => {
        setSideNavBar({
          ...sideNavBar,
          isOpen: true,
          width: '72',
        });
      },
      closeSideNav: () => {
        setSideNavBar({
          ...sideNavBar,
          isOpen: false,
        });
      },
    }),
    [sideNavBar, setSideNavBar, pageNavBar, setPageNavBar, header, setHeader],
  );

  return (
    <DocsLayoutContext.Provider value={value}>
      <div className="flex flex-col h-full w-full">{children}</div>
    </DocsLayoutContext.Provider>
  );
};

export { PageContent, PageHeader, PageLayout, PageSideNav, PageSecondaryNav };
