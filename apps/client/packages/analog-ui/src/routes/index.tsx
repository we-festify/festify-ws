import { Route, Routes } from 'react-router-dom';
import AnalogService from '../pages/service';
import RequireLoggedIn from '@sharedui/routes/require-logged-in';
import AnalogHome from '../pages/home';

import { Helmet } from 'react-helmet';

const AnalogRoutes = () => {
  return (
    <>
      <Helmet>
        <title>Festify Analog</title>
        <link rel="icon" type="image/png" href="/logos/BES.png" />
      </Helmet>
      <Routes>
        <Route path="" element={<AnalogService />} />
        <Route path="home/*" element={<RequireLoggedIn />}>
          <Route path="*" element={<AnalogHome />} />
        </Route>
      </Routes>
    </>
  );
};

export default AnalogRoutes;
