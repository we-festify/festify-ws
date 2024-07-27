import { Link, useLocation } from 'react-router-dom';
import { useGetBESDocsNavQuery } from '../../api/docs';
import { paths } from '../../constants/paths';
import { BESDocsNavItemType } from '@shared/types/bes/docs';
import { cn } from '../../../../lib/utils';

const BESDocsNav = () => {
  const { data: { nav } = {} } = useGetBESDocsNavQuery({});
  const location = useLocation();
  const rootPath = location.pathname.split(paths.DOCS)[1] || '';
  const activePath = rootPath ? rootPath?.split('/')[0] : '';

  const isPathActive = (path: string | undefined) => {
    if (!path) return activePath === '';
    return activePath === path;
  };

  return (
    <div className="w-full h-full bg-background dark:bg-slate-900 flex items-center">
      <div className="flex gap-8 px-4">
        {nav?.map((item: BESDocsNavItemType) => (
          <Link
            key={item.title}
            to={item.path ? `${paths.DOCS}${item.path}` : paths.DOCS}
            className={cn(
              'text-xs text-muted-foreground',

              isPathActive(item.path) ? 'font-bold text-primary' : ''
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BESDocsNav;
