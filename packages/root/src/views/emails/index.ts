import handlebars from 'handlebars';
import fs from 'fs';
import { getPathToAsset } from '../../utils/assets';

const testEmailTemplateSrc = fs.readFileSync(
  getPathToAsset('emails/test.hbs'),
  'utf8'
);
const forgotPasswordEmailTemplateSrc = fs.readFileSync(
  getPathToAsset('emails/forgot-password.hbs'),
  'utf8'
);
const emailVerificationTemplateSrc = fs.readFileSync(
  getPathToAsset('emails/verify-email.hbs'),
  'utf8'
);
const loginCredentialsEmailTemplateSrc = fs.readFileSync(
  getPathToAsset('emails/login-credentials.hbs'),
  'utf8'
);
const testEmailTemplate = handlebars.compile(testEmailTemplateSrc);
const forgotPasswordEmailTemplate = handlebars.compile(
  forgotPasswordEmailTemplateSrc
);
const emailVerificationTemplate = handlebars.compile(
  emailVerificationTemplateSrc
);
const loginCredentialsEmailTemplate = handlebars.compile(
  loginCredentialsEmailTemplateSrc
) as HandlebarsTemplateDelegate<{
  username: string;
  temporaryPassword: string;
}>;

const templates = {
  test: testEmailTemplate,
  forgotPassword: forgotPasswordEmailTemplate,
  emailVerification: emailVerificationTemplate,
  loginCredentials: loginCredentialsEmailTemplate,
};

export default templates;
