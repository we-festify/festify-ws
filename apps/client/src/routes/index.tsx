import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './auth';
import HomePage from '../pages/HomePage';
import DocsPage from '../pages/Docs';

// packages
import BES from '@bes-ui';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="" element={<HomePage />} />
      <Route path="docs/*">
        <Route path=":service/*" element={<DocsPage />} />
        <Route path="*" element={<DocsPage />} />
      </Route>
      <Route path="bes/*" element={<BES />} />
    </Routes>
  );
};

export default AppRoutes;
