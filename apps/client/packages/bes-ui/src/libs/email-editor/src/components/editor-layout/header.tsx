import { useEffect } from 'react';
import { useEditorLayout } from '.';
import { cn } from '@sharedui/utils/tw';
interface EditorHeaderProps {
  children?: React.ReactNode;
}

const EditorHeader = ({ children }: EditorHeaderProps) => {
  const { header, setHeader } = useEditorLayout();
  useEffect(() => {
    setHeader({
      isOpen: true,
      height: '8',
    });
  }, [setHeader]);
  return (
    <>
      {header.isOpen && (
        <div
          className={cn(
            `bg-primary/5 h-${header.height} fixed z-10 top-[76px] left-0 right-0 shadow-sm`,
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default EditorHeader;
