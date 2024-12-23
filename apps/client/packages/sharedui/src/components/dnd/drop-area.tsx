import { useRef } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

type DropAreaProps = {
  type: string;
  render?: ({ isOver }: { isOver: boolean }) => JSX.Element;
  onDrop?: (
    item: unknown,
    monitor: DropTargetMonitor,
    ref: React.RefObject<HTMLDivElement>,
  ) => void;
  [key: string]: unknown;
};

const DropArea = ({ type, render, onDrop, ...props }: DropAreaProps) => {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: (item, monitor) => onDrop?.(item, monitor, dropRef),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        drop(node);
        dropRef.current = node;
      }}
      {...props}
    >
      {render?.({ isOver })}
    </div>
  );
};

export default DropArea;
