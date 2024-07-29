import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './auth';
import HomePage from '../pages/HomePage';

// packages
import BES from '../packages/bes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="" element={<HomePage />} />

      <Route path="bes/*" element={<BES />} />
    </Routes>
  );
};

export default AppRoutes;
