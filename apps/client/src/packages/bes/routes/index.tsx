import { Route, Routes } from 'react-router-dom';
import BESService from '../pages/Service';
import RequireLoggedIn from '../../../routes/custom/RequireLoggedIn';
import BESHome from '../pages/home';

import { Helmet } from 'react-helmet';
import BESDocsPage from '../pages/Docs';

const BESRoutes = () => {
  return (
    <>
      <Helmet>
        <title>Festify Basic Email Service</title>
        <link rel="icon" type="image/png" href="/logos/BES.png" />
      </Helmet>
      <Routes>
        <Route path="" element={<BESService />} />
        <Route path="docs/*" element={<BESDocsPage />} />
        <Route path="home/*" element={<RequireLoggedIn />}>
          <Route path="*" element={<BESHome />} />
        </Route>
      </Routes>
    </>
  );
};

export default BESRoutes;
