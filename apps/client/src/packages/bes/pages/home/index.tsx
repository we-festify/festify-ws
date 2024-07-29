import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  PageContent,
  PageLayout,
  PageSideNav,
} from '../../../shared/components/PageLayout';
import HomePage from './HomePage';
import { besPaths } from '../../constants/paths';

import Instances from './Instances';
import CreateInstancePage from './Instances/Create';
import UpdateInstancePage from './Instances/Update';

import EmailTemplates from './EmailTemplates';
import CreateEmailTemplatePage from './EmailTemplates/Create';
import UpdateEmailTemplatePage from './EmailTemplates/Update';
import InstanceDetailsPage from './Instances/Details';
import EmailTemplateDetailsPage from './EmailTemplates/Details';
import { ItemProps } from '../../../shared/components/PageLayout/SideNavItem';

const BESHome = () => {
  const navigate = useNavigate();

  const handlePathChange = (path: string) => {
    if (!path) return; // ignore empty paths
    navigate(path);
  };

  return (
    <PageLayout>
      <PageSideNav
        title="Basic Email Service"
        items={sideNavItems}
        onItemClick={handlePathChange}
      />
      <PageContent>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="instances/*">
            <Route path="" element={<Instances />} />
            <Route path="create" element={<CreateInstancePage />} />
            <Route path="update/:alias" element={<UpdateInstancePage />} />
            <Route path="details/:alias" element={<InstanceDetailsPage />} />
          </Route>
          <Route path="templates/*">
            <Route path="" element={<EmailTemplates />} />
            <Route path="create" element={<CreateEmailTemplatePage />} />
            <Route
              path="update/:templateId"
              element={<UpdateEmailTemplatePage />}
            />
            <Route
              path="details/:templateId"
              element={<EmailTemplateDetailsPage />}
            />
          </Route>
        </Routes>
      </PageContent>
    </PageLayout>
  );
};

const sideNavItems = [
  { title: 'Home', path: besPaths.HOME },
  {
    title: 'Instances',
    path: besPaths.INSTANCES,
  },
  {
    title: 'Email templates',
    path: besPaths.EMAIL_TEMPLATES,
  },
] as ItemProps[];

export default BESHome;
