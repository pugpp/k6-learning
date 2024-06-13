// K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_WEB_DASHBOARD_PORT=5665 k6 run --out csv=result.csv src/simulations/functionStressTest.js
import Login from "../requests/loginReq.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

import { check, sleep } from 'k6';
import http from 'k6/http';
import { group } from "k6";
import {
    formatDate_yyyy_mm_dd,
} from "../utils/helper.js";
import { host } from "../utils/user.js";

export let options = {
    scenarios: {
        ramping_scenario: {
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1s',
            preAllocatedVUs: 1,
            maxVUs: 10,
            stages: [
                { duration: '30s', target: 5 }, // ramp-up to 5 requests/sec in 30s
                { duration: '3m', target: 5 },// stay at 5 requests/sec for 3 minutes
            ],
        },
        // contacts: {
        //     executor: "shared-iterations", // executor type
        //     vus: 1, //virtual user
        //     iterations: 10,
        //     maxDuration: "10m",
        // },
    },
    thresholds: {
        'http_req_duration': ['p(99)<2500'], // 99% of response times must be below 2.5s
        'http_req_failed': ['rate<0.01'], // error rate must be below 1%
    },
};


export function setup() {
    let login = new Login();
    if (login.getToken() !== "") return login.getToken();
    login.callLogin();
    const token = login.getToken();
    return { token };
}

// function selectEndpoint() {
//     const trafficPattern = [
//         { endpoint: '/api/v1/settings?keys=Occupation,CancelReasonCV', weight: 40 },
//         { endpoint: '/api/v1/tasks/count', weight: 30 },
//         {
//             endpoint: `/api/v1/tasks/activities-count?startDate=${formatDate_yyyy_mm_dd()}&endDate=${formatDate_yyyy_mm_dd()}`, weight: 20
//         },
//         { endpoint: '/api/v1/deals?type=Leads&limit=20', weight: 10 },
//     ];

//     const totalWeight = trafficPattern.reduce((sum, item) => sum + item.weight, 0);
//     let random = Math.random() * totalWeight;

//     for (let item of trafficPattern) {
//         if (random < item.weight) {
//             // console.log(item);
//             return item.endpoint;
//         }
//         random -= item.weight;
//     }
// }

// Traffic pattern definitions
const trafficPattern = [
    { endpoint: '/api/v1/settings?keys=Occupation,CancelReasonCV', weight: 40 },
    { endpoint: '/api/v1/tasks/count', weight: 30 },
    { endpoint: `/api/v1/tasks/activities-count?startDate=${formatDate_yyyy_mm_dd()}&endDate=${formatDate_yyyy_mm_dd()}`, weight: 20 },
    { endpoint: '/api/v1/deals?type=Leads&limit=20', weight: 10 },
];

// Cumulative weights for selection
const cumulativeWeights = trafficPattern.map((item, index) => {
    return trafficPattern.slice(0, index + 1).reduce((sum, i) => sum + i.weight, 0);
});

const totalWeight = cumulativeWeights[cumulativeWeights.length - 1];

function selectEndpoint() {
    const random = Math.random() * totalWeight;
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (random < cumulativeWeights[i]) {
            console.log('step 1# random is:', random);
            return trafficPattern[i].endpoint;
        }
    }
}

export default function (data) {
    const token = data.token;
    const endpoint = selectEndpoint();
    console.log('step 2# token is :', token);
    console.log('step 3# endpoint is :', endpoint);

    group('API Load Test', () => {
        let res = http.get(`${host.url}${endpoint}`, {
            headers: { usertoken: `${token}` },
        });
        console.log('step 4# Token in Test:', token);
        const body = JSON.parse(res.body);
        console.log('res.status :', res.status);
        const checkResult = check(res, {
            'status is 200': (r) => r.status === 200,
        });

        if (!checkResult) {
            console.log(`Non-200 response for ${endpoint}: ${res.status}`);
            console.log(`response body : ${res.body}`);
        }

    });

    sleep(1 / 5); // Maintain 5 requests per second rate
}


export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}
