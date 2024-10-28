import { Route, Routes } from 'react-router-dom';
import AIMService from '@aim-ui/pages/service';
import RequireLoggedIn from '@sharedui/routes/require-logged-in';

import { Helmet } from 'react-helmet';
import AIMHome from '@aim-ui/pages/home';

const AIMRoutes = () => {
  return (
    <>
      <Helmet>
        <title>Festify Access and Identity Manager</title>
        <link rel="icon" type="image/png" href="/logos/AIM.png" />
      </Helmet>
      <Routes>
        <Route path="" element={<AIMService />} />
        <Route path="home/*" element={<RequireLoggedIn />}>
          <Route path="*" element={<AIMHome />} />
        </Route>
      </Routes>
    </>
  );
};

export default AIMRoutes;
