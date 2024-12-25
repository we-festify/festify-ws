import React from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

type DropAreaProps = {
  type: string | string[];
  render?: ({
    isOver,
  }: {
    isOver: boolean;
    draggingItemType: string | null;
  }) => JSX.Element;
  onDragDrop?: (item: unknown, monitor: DropTargetMonitor) => void;
};

const DropArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & DropAreaProps
>(({ type, render, onDragDrop, ...props }, _ref) => {
  const [{ isOver, draggingItemType }, drop] = useDrop(() => ({
    accept: type,
    drop: (item, monitor) => onDragDrop?.(item, monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      draggingItemType: monitor.getItemType()?.toString() ?? null,
    }),
  }));

  return (
    <div ref={drop} {...props}>
      {render?.({ isOver, draggingItemType })}
    </div>
  );
});

export default DropArea;
