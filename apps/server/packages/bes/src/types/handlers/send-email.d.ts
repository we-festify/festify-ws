export interface SendEmailData extends Record<string, unknown> {
  destination: {
    to: string[];
    cc?: string[];
    bcc?: string[];
  };
  subject: string;
  content: {
    html?: string;
    text?: string;
  };
}

export interface SendTemplatedEmailData extends Record<string, unknown> {
  destination: {
    to: string[];
    cc?: string[];
    bcc?: string[];
  };
  variables: Record<string, unknown>;
}
