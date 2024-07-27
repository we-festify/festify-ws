import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './auth';
import BESRoutes from '../packages/bes/routes';
import Header from '../packages/shared/components/Header';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="" element={<div>Home</div>} />

      <Route
        path="bes/*"
        element={
          <>
            <Header />
            <BESRoutes />
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
