import { cn } from '@femails-react/utils/tw';
import { useFemailsState } from './femails-provider';
import { Hash } from 'lucide-react';
import { memo, useState } from 'react';
import { Input } from './ui/input';
import { useEventListener } from '@femails-react/hooks/useEventListener';

const LayersComponent = () => {
  const rootId = useFemailsState('nodes.root');

  return (
    <div className="w-full p-4 text-sm">
      <h2 className="font-semibold mb-2">Layers</h2>
      <LayerTile instance={rootId} depth={0} />
    </div>
  );
};

interface LayerTileProps {
  instance: string;
  depth: number;
}

const LayerTileComponent = ({
  instance: instanceId,
  depth,
}: LayerTileProps) => {
  const instance = useFemailsState(`nodes.instances.${instanceId}`);

  const handleInputChange = (value: string) => {
    instance.rename(value);
  };

  return (
    <>
      <div
        style={{ marginLeft: depth * 8 }}
        className={cn(
          'px-2 py-1 rounded-sm hover:bg-muted flex items-center gap-2 select-none',
          depth <= 0 ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        <Hash size={12} />
        <EditableTileText text={instance.name} onChange={handleInputChange} />
      </div>
      {instance.children && instance.children.length > 0 && (
        <div>
          {instance.children.map((child: string) => (
            <LayerTile key={child} instance={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  );
};

const EditableTileText = ({
  text,
  onChange,
}: {
  text: string;
  onChange: (value: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentText(e.target.value);
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(currentText);
  };

  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentText(text);
    } else if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(currentText);
    }
  });

  return isEditing ? (
    <Input
      autoFocus
      value={currentText}
      onChange={handleChange}
      onBlur={handleBlur}
      className="h-5 text-sm p-0 rounded-none focus-visible:ring-0"
    />
  ) : (
    <span onDoubleClick={handleDoubleClick} className="w-full">
      {currentText}
    </span>
  );
};

const LayerTile = memo(LayerTileComponent);
export const Layers = memo(LayersComponent);
