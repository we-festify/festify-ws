const plans = {
  free: {
    name: 'Free',
    limits: {
      bes: {
        instances: 1,
        apiCalls: 100,
      },
      ts: {
        instances: 1,
        apiCalls: 100,
      },
    },
  },
  payg: {
    name: 'Pay as you go',
    freeQuota: {
      bes: {
        instances: 1,
        apiCalls: 100,
      },
      ts: {
        instances: 1,
        apiCalls: 100,
      },
    },
    prices: {
      bes: {
        instances: 0.01,
        apiCalls: 0.001,
      },
      ts: {
        instances: 0.01,
        apiCalls: 0.001,
      },
    },
  },
};

export default plans;
