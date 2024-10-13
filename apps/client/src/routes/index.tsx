import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './auth';
import HomePage from '../pages/home-page';
import DocsPage from '../pages/docs';

// packages
import BESServiceIndex from '@bes-ui/index';
import NotFound from '@/pages/not-found';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="" element={<HomePage />} />
      <Route path="docs/*">
        <Route path=":service/*" element={<DocsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="bes/*" element={<BESServiceIndex />} />
    </Routes>
  );
};

export default AppRoutes;
