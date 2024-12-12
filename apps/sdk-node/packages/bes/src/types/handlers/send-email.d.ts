export type BesSendEmailConfig = {
  data: {
    toAddresses: string[];
    ccAddresses?: string[];
    bccAddresses?: string[];
    subject: string;
    html?: string;
    text?: string;
  };

  instanceFrn: string;
};

export type BesSendEmailResponseData = {
  messageId: string;
};
