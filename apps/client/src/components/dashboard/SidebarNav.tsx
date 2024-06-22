import { cn } from '../../lib/utils';
import { buttonVariants } from '../ui/button';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../custom/Logo';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const matches = (href: string) => {
    // if the href has /* at the end, we need to check if the pathname starts with the href
    if (href.endsWith('/*')) {
      return pathname.startsWith(href.slice(0, -2));
    }
    return pathname === href;
  };

  const cleanPathname = (pathname: string) => {
    if (pathname.endsWith('/')) {
      return pathname.slice(0, -1);
    } else if (pathname.endsWith('/*')) {
      return pathname.slice(0, -2);
    }
    return pathname;
  };

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 p-4 sticky top-0 z-10 lg:h-screen overflow-y-auto',
        className
      )}
      {...props}
    >
      <Logo className="text-xl md:mr-auto lg:mr-0 lg:mb-10" />
      <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={cleanPathname(item.href)}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              matches(item.href)
                ? 'bg-muted hover:bg-muted'
                : 'hover:bg-muted/70',
              'justify-start'
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
