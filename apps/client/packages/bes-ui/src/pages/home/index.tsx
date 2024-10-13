import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  PageContent,
  PageLayout,
  PageSideNav,
} from '@sharedui/components/page-layout';
import HomePage from './home-page';
import { besPaths } from '@sharedui/constants/paths';

import Instances from './instances';
import CreateInstancePage from './instances/create';
import UpdateInstancePage from './instances/update';

import EmailTemplates from './email-templates';
import CreateEmailTemplatePage from './email-templates/create';
import UpdateEmailTemplatePage from './email-templates/update';
import InstanceDetailsPage from './instances/details';
import EmailTemplateDetailsPage from './email-templates/details';
import { ItemProps } from '@sharedui/components/page-layout/side-nav-item';

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
