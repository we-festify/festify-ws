import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from '../components/auth/index';
import AuthLayout from '../pages/auth/layout';
import { Route, Routes } from 'react-router-dom';

const AuthRoutes = () => {
  return (
    <AuthLayout>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Routes>
    </AuthLayout>
  );
};

export default AuthRoutes;
