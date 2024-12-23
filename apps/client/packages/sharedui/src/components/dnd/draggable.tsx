import { cn } from '@sharedui/utils/tw';
import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableProps {
  type: string;
  render?: ({ isDragging }: { isDragging: boolean }) => JSX.Element;
  data?: unknown;
}

const Draggable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & DraggableProps
>(({ data, type, render, className, ...props }, _ref) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { data },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        'cursor-grab translate-x-0 translate-y-0',
        isDragging && 'opacity-50',
        className,
      )}
      {...props}
    >
      {render?.({ isDragging })}
    </div>
  );
});
Draggable.displayName = 'Draggable';

export default Draggable;
