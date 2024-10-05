import { Link, useLocation, useParams } from 'react-router-dom';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { besPaths } from '../../constants/paths';
import { BESDocsNavItemType } from '@sharedtypes/bes/docs';
import { cn } from '../../utils/tw';

const DocsNav = () => {
  const { service } = useParams();
  const { data: { nav } = {} } = useGetDocsNavQuery<{
    data: { nav: BESDocsNavItemType[] };
  }>(service);
  const location = useLocation();
  const rootPath = location.pathname.split(besPaths.DOCS)[1] || '';
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
            to={item.path ? `${besPaths.DOCS}${item.path}` : besPaths.DOCS}
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

export default DocsNav;
