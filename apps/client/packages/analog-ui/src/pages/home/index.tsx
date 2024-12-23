import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  PageContent,
  PageLayout,
  PageSecondaryNav,
  PageSideNav,
} from '@sharedui/components/page-layout';
import HomePage from './home-page';
import Insights from './insights';
import { analogPaths } from '@sharedui/constants/paths';
import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';
import Toolbox from '@analog-ui/components/toolbox';

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
          <Route
            path="insights"
            element={
              <>
                <Insights />
                <PageSecondaryNav leading={<Toolbox />} />
              </>
            }
          />
        </Routes>
      </PageContent>
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
