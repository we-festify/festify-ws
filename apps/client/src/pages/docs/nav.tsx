import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetDocsNavQuery } from '@rootui/api/docs';
import { IDocsNav } from '@sharedtypes/docs';
import { cn } from '../../../packages/sharedui/src/utils/tw';
import { getNearestPath } from '@/utils/docs';
import { useEffect } from 'react';
import paths from '@sharedui/constants/paths';

const DocsNav = () => {
  const { topic } = useParams();
  const { data: { nav } = {} } = useGetDocsNavQuery<{
    data: { nav: IDocsNav };
  }>(topic ?? '', {
    skip: !topic,
  });
  const location = useLocation();
  const filePath = location.pathname.split(`/docs/${topic}/`)[1];
  const section = filePath?.split('/')[0];
  const navigate = useNavigate();

  const isSectionActive = (path: string | undefined) => {
    if (!path) return section === '';
    return path.startsWith(section);
  };

  useEffect(() => {
    if (nav && !section) {
      navigate(`${paths.root.DOCS}/${topic}/${getNearestPath(nav[0])}`);
    }
  }, [nav, section, navigate, topic]);

  return (
    <div className="w-full h-full bg-background dark:bg-slate-900 flex items-center">
      <div className="flex gap-8 px-4">
        {nav?.map((item) => (
          <Link
            key={item.title}
            to={`/docs/${topic}/${getNearestPath(item)}`}
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
