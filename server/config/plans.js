/**
 * Plan configuration
 * @typedef {Object} Plan
 * @property {string} name - Plan name
 * @property {Object.<string, {instances: number, apiCalls: number}>} limits - Limits for each service
 * @property {Object.<string, {instances: number, apiCalls: number}>} freeQuota - Free quota for each service
 * @property {Object.<string, {instances: number, apiCalls: number}>} prices - Prices for each service
 *
 * @type {Object.<string, Plan>}
 */
const plans = {
  free: {
    name: "Free",
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
    name: "Pay as you go",
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

module.exports = plans;
