export type BesSendTemplatedEmailConfig = {
  data: {
    destination: {
      to: string[];
      cc?: string[];
      bcc?: string[];
    };
    variables: Record<string, unknown>;
  };

  resource: [string, string];
};

export type BesSendTemplatedEmailResponseData = {
  jobId: string;
};
