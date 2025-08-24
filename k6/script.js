import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '1m', target: 300 },   // Stay at 300 RPS
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // Requirement: p95 < 150ms
  },
};

// drill ID from your database
const DRILL_ID = '68a9c5c7479ffe318ef2eac8'; 

export default function () {
  // Test GET /api/drills (cached route)
  const drillsResponse = http.get('http://localhost:4000/api/drills');
  check(drillsResponse, {
    'drills response status is 200': (r) => r.status === 200,
    'drills response time p95 < 150ms': (r) => r.timings.duration < 150,
  });

  // Test GET /api/drills/:id 
  const drillResponse = http.get(`http://localhost:4000/api/drills/${DRILL_ID}`);
  check(drillResponse, {
    'drill detail status is 200': (r) => r.status === 200,
  });

  sleep(1);
}