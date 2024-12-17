export type BesSendEmailConfig = {
  data: {
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
  };

  resource: string;
};

export type BesSendEmailResponseData = {
  jobId: string;
};
