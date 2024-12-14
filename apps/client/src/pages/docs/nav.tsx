import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { cn } from '../../../packages/sharedui/src/utils/tw';
import { getNearestPath } from '@/utils/docs';
import { useEffect } from 'react';
import paths from '@sharedui/constants/paths';

const DocsNav = () => {
  const location = useLocation();
  const filePath = location.pathname
    .split(paths.root.DOCS)[1]
    .replace(/^\//, '');
  const [topic, section] = filePath.split('/');
  const { data: { nav } = {}, isLoading } = useGetDocsNavQuery(topic ?? '', {
    skip: !topic,
  });
  const navigate = useNavigate();

  const isSectionActive = (path: string | undefined) => {
    if (!path) return section === '';
    return path.startsWith(`${topic}/${section}`);
  };

  useEffect(() => {
    if (isLoading) return;
    if (nav && !section) {
      navigate(`${paths.root.DOCS}/${getNearestPath(nav[0])}`);
    }
  }, [nav, section, navigate, topic, isLoading]);

  return (
    <div className="w-full h-full bg-background dark:bg-slate-900 flex items-center">
      <div className="flex gap-8 px-4">
        {nav?.map((item) => (
          <Link
            key={item.title}
            to={`/docs/${getNearestPath(item)}`}
            className={cn(
              'text-xs text-muted-foreground',
              isSectionActive(getNearestPath(item))
                ? 'font-bold text-primary'
                : '',
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
