import { cn } from '@sharedui/utils/tw';
import { Info } from 'lucide-react';

interface HelpProps {
  children: React.ReactNode;
  variant?: 'muted' | 'primary';
}

const Help = ({ children, variant = 'primary' }: HelpProps) => {
  return (
    <span className="inline-block relative group">
      <Info
        size={16}
        className={cn(
          'text-muted-foreground',
          variant === 'primary' && 'text-blue-600',
        )}
      />
      <div className="text-sm absolute bottom-[24px] left-1/3 w-max max-w-60 mx-2 px-2 py-1 rounded-sm z-50 hidden group-hover:block bg-muted ring-1 ring-primary/10">
        {children}
      </div>
    </span>
  );
};

export default Help;
