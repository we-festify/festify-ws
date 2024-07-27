import { cn } from '../../../../lib/utils';
import { usePageLayout } from '.';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

const PageContent = ({ children, className }: PageContentProps) => {
  const { header, sideNavBar, pageNavBar } = usePageLayout();

  return (
    <main
      className={cn(
        'transition-width bg-muted dark:bg-background',
        'pl-0 pr-0', // for registering the classnames
        'pl-12 pr-12', // for registering the classnames
        'pl-72 pr-72', // for registering the classnames
        `pl-${sideNavBar.width} pr-${pageNavBar.width}`,
        header.isOpen
          ? 'min-h-[calc(100dvh-108px)] mt-8'
          : 'min-h-[calc(100dvh-76px)]',
        className
      )}
    >
      {children}
    </main>
  );
};

export default PageContent;
