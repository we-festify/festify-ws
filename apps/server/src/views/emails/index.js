const handlebars = require('handlebars');
const fs = require('fs');
const { getPathToAsset } = require('@server/utils/assets');

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
const testEmailTemplate = handlebars.compile(testEmailTemplateSrc);
const forgotPasswordEmailTemplate = handlebars.compile(
  forgotPasswordEmailTemplateSrc
);
const emailVerificationTemplate = handlebars.compile(
  emailVerificationTemplateSrc
);

const templates = {
  test: testEmailTemplate,
  forgotPassword: forgotPasswordEmailTemplate,
  emailVerification: emailVerificationTemplate,
};

module.exports = templates;
