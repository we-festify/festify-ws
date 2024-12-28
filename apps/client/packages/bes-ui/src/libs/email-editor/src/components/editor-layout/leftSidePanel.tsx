import { Menu, X } from 'lucide-react';
import { cn } from '@sharedui/utils/tw';
import { useEffect } from 'react';
import { useEditorLayout } from '.';
import SidePanelItems, { ItemProps } from './sidePanelItems';

interface EditorLeftSidePanelProps {
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

const EditorLeftSidePanel = ({
  defaultOpen = true,
  title,
  subTitle,
  leading,
  footer,
  items,
  onItemClick,
  selectedItem = isItemActive,
}: EditorLeftSidePanelProps) => {
  const { header, leftSidePanel, setLeftSidePanel } = useEditorLayout();

  useEffect(() => {
    if (defaultOpen) {
      setLeftSidePanel({
        isOpen: true,
        width: '72',
      });
    } else {
      setLeftSidePanel({
        isOpen: false,
        width: '12',
      });
    }
  }, [defaultOpen, setLeftSidePanel]);

  return (
    <div
      className={cn(
        'h-[calc(100dvh-76px)] fixed top-[76px] left-0 overflow-x-hidden overflow-y-auto border-r-2 border-r-muted bg-background dark:bg-muted transition-width',
        leftSidePanel.isOpen ? 'w-72' : 'w-12',
        'mt-8', // register the classnames
        'mt-0', // register the classnames
        `mt-${header.height}`,
      )}
    >
      {leftSidePanel.isOpen ? (
        <div className="w-full relative">
          <span
            onClick={() =>
              setLeftSidePanel({
                isOpen: false,
                width: '12',
              })
            }
            className="absolute top-0.5 right-0.5 rounded-full p-2 hover:stroke-primary hover:bg-muted cursor-pointer"
          >
            <X size={20} className="text-muted-foreground" />
          </span>
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
        <div
          onClick={() =>
            setLeftSidePanel({
              isOpen: true,
              width: '72',
            })
          }
          className="w-full h-full cursor-pointer flex justify-center py-2"
        >
          <Menu size={20} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default EditorLeftSidePanel;
