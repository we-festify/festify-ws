import { Link, useLocation, useParams } from 'react-router-dom';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { IDocsNav } from '@sharedtypes/docs';
import { cn } from '../../utils/tw';
import paths from '@sharedui/constants/paths';

const DocsNav = () => {
  const { service } = useParams();
  const { data: { nav } = {} } = useGetDocsNavQuery<{
    data: { nav: IDocsNav };
  }>(service);
  const rootPath = service ? paths.root.DOCS + '/' + service : paths.root.DOCS;
  const location = useLocation();
  const sectionPath = location.pathname.split(rootPath)[1];
  const activePath = sectionPath ? sectionPath?.split('/')[1] : '';

  const isPathActive = (path: string | undefined) => {
    if (!path) return activePath === '';
    return activePath === path;
  };

  return (
    <div className="w-full h-full bg-background dark:bg-slate-900 flex items-center">
      <div className="flex gap-8 px-4">
        {nav?.map((item) => (
          <Link
            key={item.title}
            to={item.path ? `${rootPath}/${item.path}` : rootPath}
            className={cn(
              'text-xs text-muted-foreground',

              isPathActive(item.path) ? 'font-bold text-primary' : '',
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
