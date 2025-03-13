import { Route, Routes } from 'react-router-dom';
import MethodsService from '../pages/service';
import RequireLoggedIn from '@sharedui/routes/require-logged-in';
import MethodsHome from '../pages/home';

import { Helmet } from 'react-helmet';

const MethodsRoutes = () => {
  return (
    <>
      <Helmet>
        <title>Festify Methods</title>
        <link rel="icon" type="image/png" href="/logos/Methods.png" />
      </Helmet>
      <Routes>
        <Route path="" element={<MethodsService />} />
        <Route path="home/*" element={<RequireLoggedIn />}>
          <Route path="*" element={<MethodsHome />} />
        </Route>
      </Routes>
    </>
  );
};

export default MethodsRoutes;
