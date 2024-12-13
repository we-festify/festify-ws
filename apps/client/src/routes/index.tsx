import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './auth';
import HomePage from '../pages/home-page';
import DocsPage from '../pages/documentation';
import NotFound from '@/pages/not-found';

// packages
import BESServiceIndex from '@bes-ui/index';
import AIMServiceIndex from '@aim-ui/index';
import Dashboard from '@/pages/dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="" element={<HomePage />} />
      <Route path="home" element={<Dashboard />} />
      <Route path="docs/*">
        <Route path=":service/*" element={<DocsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* d-services */}
      <Route path="bes/*" element={<BESServiceIndex />} />
      <Route path="aim/*" element={<AIMServiceIndex />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
