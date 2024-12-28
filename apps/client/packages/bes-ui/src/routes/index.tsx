import { Route, Routes } from 'react-router-dom';
import BESService from '../pages/service';
import RequireLoggedIn from '@sharedui/routes/require-logged-in';
import BESHome from '../pages/home';

import { Helmet } from 'react-helmet';
import EmailEditor from '@bes-ui/libs/email-editor/src';

const BESRoutes = () => {
  return (
    <>
      <Helmet>
        <title>Festify Basic Email Service</title>
        <link rel="icon" type="image/png" href="/logos/BES.png" />
      </Helmet>
      <Routes>
        <Route path="editor" element={<EmailEditor />} />
        <Route path="" element={<BESService />} />
        <Route path="home/*" element={<RequireLoggedIn />}>
          <Route path="*" element={<BESHome />} />
        </Route>
      </Routes>
    </>
  );
};

export default BESRoutes;
