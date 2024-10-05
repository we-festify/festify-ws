import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../primitives/collapsible';
import { cn } from '../../utils/tw';

export interface ItemProps {
  title: string;
  path: string;
  children?: ItemProps[];
  activeOnSubPaths?: boolean;
}

interface NavItemProps {
  item: ItemProps;
  onItemClick?: (path: string, item?: ItemProps) => void;
  selectedItem?: (path: string, item?: ItemProps) => boolean;
}

const hasAnyChildSelected = (child: ItemProps): boolean => {
  if (child.path === window.location.pathname) return true;
  if (child.children) {
    return child.children.some((c) => hasAnyChildSelected(c));
  }
  return false;
};

const SideNavItem = ({
  item,
  onItemClick,
  selectedItem = () => false,
}: NavItemProps) => {
  const hasChildren = item.children?.length;
  const [isOpen, setIsOpen] = useState(
    hasChildren ? item.children?.some(hasAnyChildSelected) : false
  );

  const handleItemClick = () => {
    if (hasChildren) {
      setIsOpen((prev) => !prev);
    }
    if (item.path) onItemClick?.(item.path, item);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <li
          className={cn(
            'cursor-pointer hover:text-blue-700 dark:hover:text-blue-500 w-full flex items-center justify-between',
            selectedItem(item.path, item) &&
              'text-blue-700 dark:text-blue-500 font-semibold'
          )}
        >
          <span onClick={handleItemClick}>{item.title}</span>
          {hasChildren &&
            (isOpen ? (
              <ChevronUp size={20} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={20} className="text-muted-foreground" />
            ))}
        </li>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {hasChildren && (
          <ul className="py-3 space-y-2.5 pl-5">
            {item.children?.map((child) => (
              <SideNavItem
                key={child.path}
                item={child}
                onItemClick={onItemClick}
                selectedItem={selectedItem}
              />
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SideNavItem;
