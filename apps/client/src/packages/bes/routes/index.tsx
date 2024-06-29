import { Route, Routes } from 'react-router-dom';
import BESService from '../pages/Service';
import BESInstance from '../pages/Instance';

const BESRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<BESService />} />
      <Route path="instances/:instanceId/*" element={<BESInstance />} />
    </Routes>
  );
};

export default BESRoutes;
