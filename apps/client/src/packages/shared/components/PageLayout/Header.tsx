import { useEffect } from 'react';
import { usePageLayout } from '.';

interface PageHeaderProps {
  children?: React.ReactNode;
}

const PageHeader = ({ children }: PageHeaderProps) => {
  const { setHeader } = usePageLayout();

  useEffect(() => {
    setHeader({
      isOpen: true,
      height: '8',
    });
  }, [setHeader]);

  return (
    <div className="bg-primary/5 h-8 fixed z-10 top-[76px] left-0 right-0 shadow-sm">
      {children}
    </div>
  );
};

export default PageHeader;
