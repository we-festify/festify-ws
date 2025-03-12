import { Route, Routes } from 'react-router-dom';
import BridgeService from '../pages/service';
import RequireLoggedIn from '@sharedui/routes/require-logged-in';
import BridgeHome from '../pages/home';

import { Helmet } from 'react-helmet';

const BridgeRoutes = () => {
  return (
    <>
      <Helmet>
        <title>Festify Bridge</title>
        <link rel="icon" type="image/png" href="/logos/Bridge.png" />
      </Helmet>
      <Routes>
        <Route path="" element={<BridgeService />} />
        <Route path="home/*" element={<RequireLoggedIn />}>
          <Route path="*" element={<BridgeHome />} />
        </Route>
      </Routes>
    </>
  );
};

export default BridgeRoutes;
