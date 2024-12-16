export interface SendEmailDTO {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
}
