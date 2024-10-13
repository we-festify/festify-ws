import { Info, OctagonAlert, TriangleAlert } from 'lucide-react';

interface NoteProps {
  variant: 'info' | 'danger' | 'warn';
  children: React.ReactNode;
}

const Note = ({ variant, children }: NoteProps) => {
  if (variant === 'info') {
    return (
      <div className="ring-blue-500/50 bg-blue-500/15 p-4 rounded-md mb-4 ring-1 flex gap-3">
        <Info className="text-blue-600 mt-0.5" size={18} />
        <div className="space-y-1.5 text-sm">
          <span className="font-semibold">Note</span>
          <div>{children}</div>
        </div>
      </div>
    );
  } else if (variant === 'danger') {
    return (
      <div className="ring-red-500/50 bg-red-500/15 p-4 rounded-md mb-4 ring-1 flex gap-3">
        <OctagonAlert className="text-red-600 mt-0.5" size={18} />
        <div className="space-y-1.5 text-sm">
          <span className="font-semibold">Note</span>
          <div>{children}</div>
        </div>
      </div>
    );
  } else if (variant === 'warn') {
    return (
      <div className="ring-yellow-500/50 bg-yellow-500/15 p-4 rounded-md mb-4 ring-1 flex gap-3">
        <TriangleAlert className="text-yellow-600 mt-0.5" size={18} />
        <div className="space-y-1.5 text-sm">
          <span className="font-semibold">Note</span>
          <div>{children}</div>
        </div>
      </div>
    );
  }
  return null;
};

export default Note;
