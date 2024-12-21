import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  PageContent,
  PageLayout,
  PageSecondaryNav,
  PageSideNav,
} from '@sharedui/components/page-layout';
import HomePage from './home-page';
import { analogPaths } from '@sharedui/constants/paths';

import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';
import Insights from './insights';

const AnalogHome = () => {
  const navigate = useNavigate();

  const handlePathChange = (path: string) => {
    if (!path) return; // ignore empty paths
    navigate(path);
  };

  return (
    <PageLayout>
      <PageSideNav
        title="Festify Analog"
        items={sideNavItems}
        onItemClick={handlePathChange}
      />
      <PageContent>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="insights" element={<Insights />} />
        </Routes>
      </PageContent>
      <Routes>
        <Route path="insights" element={<PageSecondaryNav />} />
      </Routes>
    </PageLayout>
  );
};

const sideNavItems = [
  { title: 'Home', path: analogPaths.HOME },
  {
    title: 'Insights',
    path: analogPaths.INSIGHTS,
  },
] as ItemProps[];

export default AnalogHome;
