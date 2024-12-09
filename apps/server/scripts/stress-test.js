import http from 'k6/http';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '1m', target: 100 }, // warm up
    { duration: '1m', target: 100 }, // stay at 100 users for 1 minute

    { duration: '2m', target: 500 }, // scale up
    { duration: '1m', target: 500 }, // stay at 500 users for 3 minutes

    { duration: '3m', target: 300 }, // scale down

    { duration: '1m30s', target: 0 }, // cool down
  ],
};

const API_BASE_URL = 'http://localhost:5000';

export default function () {
  const headers = {
    // Custom headers for the requests
    'Content-Type': 'application/json',
    'x-fws-ak': '675595495001cfafc2c78d1d',
    'x-fws-sig': 'fake-signature',
  };
  const body = JSON.stringify({
    // Request body
    // ...
  });
  http.post(`${API_BASE_URL}/api/v1/d/aim/execute/ListManagedUsers`, body, {
    headers,
  });
}
