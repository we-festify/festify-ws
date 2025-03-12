import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  PageContent,
  PageLayout,
  PageSideNav,
} from '@sharedui/components/page-layout';
import HomePage from './home-page';
import { bridgePaths } from '@sharedui/constants/paths';

import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';
import { APIs } from './apis';
import { CreateApiPage } from './apis/create';
import { ApiDetailsPage } from './apis/details';
import { CreateApiEndpointPage } from './apis/details/endpoints/create';
import { UpdateApiEndpointPage } from './apis/details/endpoints/update';

const BridgeHome = () => {
  const navigate = useNavigate();

  const handlePathChange = (path: string) => {
    if (!path) return; // ignore empty paths
    navigate(path);
  };

  return (
    <PageLayout>
      <PageSideNav
        title="Festify Bridge"
        items={sideNavItems}
        onItemClick={handlePathChange}
      />
      <PageContent>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="apis/*">
            <Route path="" element={<APIs />} />
            <Route path="create" element={<CreateApiPage />} />
            <Route path="details/:apiId/*">
              <Route path="" element={<ApiDetailsPage />} />
              <Route path="endpoints/*">
                <Route path="create" element={<CreateApiEndpointPage />} />
                <Route path="update" element={<UpdateApiEndpointPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </PageContent>
    </PageLayout>
  );
};

const sideNavItems = [
  { title: 'Home', path: bridgePaths.HOME },
  {
    title: 'APIs',
    path: bridgePaths.APIS,
  },
] as ItemProps[];

export default BridgeHome;
