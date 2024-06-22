import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  VerifyEmailForm,
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
        <Route path="/verify-email" element={<VerifyEmailForm />} />
      </Routes>
    </AuthLayout>
  );
};

export default AuthRoutes;
