// Load Test Script for Express API

// Tunable parameters
const config = {
  targetUrl: 'http://localhost:5000/api/v1/d/aim/execute/ListManagedUsers', // Replace with your API URL
  totalRequests: 1000, // Total number of requests to send
  concurrency: 50, // Number of concurrent requests
  requestInterval: 100, // Time (ms) between starting new requests
  requestTimeout: 5000, // Timeout for each request in milliseconds
  reportGranularity: 100, // Interval for intermediate reporting
  headers: {
    // Custom headers for the requests
    'Content-Type': 'application/json',
    'x-fws-ak': '67556620d6a28f3e868350c2',
    'x-fws-sig': 'some-fake-signature',
  },
  body: JSON.stringify({
    // Custom body for the requests (optional)
    resource: 'value',
  }),
};

let results = [] as number[];
// let completedRequests = 0;
let errors = 0;

// Delay utility to throttle requests
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to send a single HTTP request
async function sendRequest() {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.requestTimeout,
    );

    await fetch(config.targetUrl, {
      method: 'POST', // Change method as needed
      headers: config.headers,
      body: config.body,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const duration = Date.now() - start;
    results.push(duration);
  } catch (_err) {
    errors++;
  }
}

// Function to manage requests with throttling and concurrency
async function runLoadTest() {
  console.log(
    `Starting load test with ${config.totalRequests} requests and ${config.concurrency} concurrency...`,
  );

  const startTime = Date.now();
  const activeRequests = new Set();

  for (let i = 0; i < config.totalRequests; i++) {
    // Throttle requests by delaying their start
    if (activeRequests.size >= config.concurrency) {
      await Promise.race(activeRequests);
    }

    const requestPromise = sendRequest().finally(() =>
      activeRequests.delete(requestPromise),
    );
    activeRequests.add(requestPromise);

    if (i % config.reportGranularity === 0 && i > 0) {
      console.log(`Intermediate Report: ${i} requests initiated.`);
    }

    // Introduce a delay before starting the next request
    if (i < config.totalRequests - 1) {
      await delay(config.requestInterval);
    }
  }

  // Wait for all active requests to complete
  await Promise.all(activeRequests);

  const totalTime = Date.now() - startTime;
  generateReport(totalTime);
}

// Function to generate an insightful report
function generateReport(totalTime: number) {
  const successfulRequests = results.length;
  const totalRequests = config.totalRequests;
  const errorPercentage = ((errors / totalRequests) * 100).toFixed(2);
  const avgResponseTime = (
    results.reduce((a, b) => a + b, 0) / successfulRequests
  ).toFixed(2);
  const minResponseTime = Math.min(...results).toFixed(2);
  const maxResponseTime = Math.max(...results).toFixed(2);
  const requestsPerSecond = (successfulRequests / (totalTime / 1000)).toFixed(
    2,
  );
  const throughput = (
    (successfulRequests + errors) /
    Number(avgResponseTime)
  ).toFixed(2);

  console.log(`\nLoad Test Report:`);
  console.log(`----------------------------`);
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Successful Requests: ${successfulRequests}`);
  console.log(`Errored Requests: ${errors}`);
  console.log(`Error Percentage: ${errorPercentage}%`);
  console.log(`Average Response Time: ${avgResponseTime} ms`);
  console.log(`Minimum Response Time: ${minResponseTime} ms`);
  console.log(`Maximum Response Time: ${maxResponseTime} ms`);
  console.log(`Requests per Second: ${requestsPerSecond}`);
  console.log(`Throughput: ${throughput} requests`);
  console.log(`Total Time: ${(totalTime / 1000).toFixed(2)} seconds`);
}

// Run the load test
runLoadTest();
