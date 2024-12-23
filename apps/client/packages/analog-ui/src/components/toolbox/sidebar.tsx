import Draggable from '@sharedui/components/dnd/draggable';

/**
 * @deprecated This component is deprecated and will be removed in the next release.
 */
const Sidebar = () => {
  return (
    <div>
      <div
        draggable={true}
        className="bg-gray-200 p-2"
        onDragStart={(e) => {
          e.dataTransfer.setData('text', 'Hello World');
        }}
      >
        Drag me around
      </div>
      <Draggable
        type="card"
        data={{ id: '1', title: 'Card 1' }}
        render={({ isDragging }) => (
          <div>{isDragging ? 'Dragging' : 'Drag me'}</div>
        )}
        onDragStart={(e) => {
          e.dataTransfer.setData('text', JSON.stringify({ type: 'chart' }));
        }}
      />
      <Draggable
        type="card"
        data={{ id: '2', title: 'Card 2' }}
        render={({ isDragging }) => (
          <div>{isDragging ? 'Dragging' : 'Drag me'}</div>
        )}
      />
    </div>
  );
};

export default Sidebar;
