import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  VerifyEmailForm,
} from "@/components/auth";
import Layout from "@/pages/auth/layout";
import { Route, Routes } from "react-router-dom";

const AuthRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/verify-email" element={<VerifyEmailForm />} />
      </Routes>
    </Layout>
  );
};

export default AuthRoutes;
