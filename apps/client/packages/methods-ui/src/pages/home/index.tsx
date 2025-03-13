import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  PageContent,
  PageLayout,
  PageSideNav,
} from '@sharedui/components/page-layout';
import { methodsPaths } from '@sharedui/constants/paths';
import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';
import { Handlers } from './handlers';
import { CreateHandlerPage } from './handlers/create';
import { HandlerDetailsPage } from './handlers/details';
import { HomePage } from './home-page';

const MethodsHome = () => {
  const navigate = useNavigate();

  const handlePathChange = (path: string) => {
    if (!path) return; // ignore empty paths
    navigate(path);
  };

  return (
    <PageLayout>
      <PageSideNav
        title="Festify Methods"
        items={sideNavItems}
        onItemClick={handlePathChange}
      />
      <PageContent>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="handlers/*">
            <Route path="" element={<Handlers />} />
            <Route path="create" element={<CreateHandlerPage />} />
            <Route path="details/:handlerId" element={<HandlerDetailsPage />} />
          </Route>
        </Routes>
      </PageContent>
    </PageLayout>
  );
};

const sideNavItems = [
  { title: 'Home', path: methodsPaths.HOME },
  {
    title: 'Handlers',
    path: methodsPaths.HANDLERS,
  },
] as ItemProps[];

export default MethodsHome;
