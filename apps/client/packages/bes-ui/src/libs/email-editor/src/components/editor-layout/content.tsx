import { cn } from '@sharedui/utils/tw';
import { useEditorLayout } from '.';

interface EditorContentProps {
  children: React.ReactNode;
  className?: string;
}

const EditorContent = ({ children, className }: EditorContentProps) => {
  const { header, leftSidePanel, rightSidePanel } = useEditorLayout();

  return (
    <main
      className={cn(
        'transition-width bg-muted dark:bg-background',
        'pl-0 pr-0', // for registering the classnames
        'pl-12 pr-12', // for registering the classnames
        'pl-72 pr-72', // for registering the classnames
        `pl-${leftSidePanel.width} pr-${rightSidePanel.width}`,
        header.isOpen
          ? 'min-h-[calc(100dvh-108px)] mt-8'
          : 'min-h-[calc(100dvh-76px)]',
        className,
      )}
    >
      {children}
    </main>
  );
};

export default EditorContent;
