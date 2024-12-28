import { Info, X } from 'lucide-react';
import { cn } from '@sharedui/utils/tw';
import { useEffect } from 'react';
import { useEditorLayout } from '.';
import SidePanelItems, { ItemProps } from './sidePanelItems';

interface EditorRightSidePanelProps {
  defaultOpen?: boolean;
  title?: string;
  subTitle?: string;
  items?: ItemProps[];
  onItemClick?: (path: string, item?: ItemProps) => void;
  leading?: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Function to determine if an item is selected
   */
  selectedItem?: (path: string) => boolean;
}

const isItemActive = (path: string, item?: ItemProps) => {
  if (window.location.pathname === path) {
    return true;
  }

  if (window.location.pathname.includes(path) && item?.activeOnSubPaths) {
    return true;
  }

  return false;
};

const EditorRightSidePanel = ({
  defaultOpen = true,
  title,
  subTitle,
  leading,
  footer,
  items,
  onItemClick,
  selectedItem = isItemActive,
}: EditorRightSidePanelProps) => {
  const { header, rightSidePanel, setRightSidePanel } = useEditorLayout();

  useEffect(() => {
    if (defaultOpen) {
      setRightSidePanel({
        isOpen: true,
        width: '72',
      });
    } else {
      setRightSidePanel({
        isOpen: false,
        width: '12',
      });
    }
  }, [defaultOpen, setRightSidePanel]);

  return (
    <div
      className={cn(
        'h-[calc(100dvh-76px)] fixed top-[76px] right-0 overflow-x-hidden overflow-y-auto border-l-2 border-l-muted bg-background dark:bg-muted transition-width',
        rightSidePanel.isOpen ? 'w-72' : 'w-12',
        'mt-8', // register the classnames
        'mt-0', // register the classnames
        `mt-${header.height}`,
      )}
    >
      {rightSidePanel.isOpen ? (
        <div className="w-full relative">
          <button
            title="Close"
            onClick={() =>
              setRightSidePanel({
                isOpen: false,
                width: '12',
              })
            }
            className="absolute top-0.5 right-1 rounded-full p-2 hover:stroke-primary hover:bg-muted cursor-pointer"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
          {title && (
            <div className="w-full py-3 px-6 border-b-2 border-b-muted dark:border-slate-800">
              <h3 className="text-lg font-semibold pr-4">{title}</h3>
              <h4 className="text-xs text-muted-foreground">{subTitle}</h4>
            </div>
          )}
          {leading}
          {items && (
            <ul className="p-6 space-y-2.5 text-sm">
              {items.map((item) => (
                <SidePanelItems
                  key={item.path}
                  item={item}
                  onItemClick={onItemClick}
                  selectedItem={selectedItem}
                />
              ))}
            </ul>
          )}
          {footer}
        </div>
      ) : (
        <button
          title="Open"
          onClick={() =>
            setRightSidePanel({
              isOpen: true,
              width: '72',
            })
          }
          className="w-full h-full cursor-pointer flex justify-center py-2"
        >
          <Info size={20} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

export default EditorRightSidePanel;
