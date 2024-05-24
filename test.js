// command run
// k6 run --out json=test_result.json --out web-dashboard test.js
import http from "k6/http";
import { check, sleep, fail } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { getRandom10DigitNumber, generateRandomString } from "./helper.js";

let golbalsToken = "";
export const host = {
  url: "https://msc-service-v2-stg.isuzu-tis.com",
  username: "404700003",
  password: "Init123456",
};

export const options = {
  scenarios: {
    contacts: {
      executor: "shared-iterations", // executor type
      vus: 1, //virtual user
      iterations: 1,
      maxDuration: "10m",
    },
  },
  // thresholds: {
  //   http_req_duration: ["p(90)<5"],
  // },
};

export default function () {
  const url = `${host.url}/api/v1/login`;
  const payload = JSON.stringify({
    username: host.username,
    password: host.password,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);
  if (res.status == 200) {
    const body = JSON.parse(res.body); // แปลง string to object
    golbalsToken = body.UserToken;
    console.log("golbalsToken is : ", golbalsToken);
  }

  sleep(1); // delay before sent req again because if not delay it will be same like user press f5
  check(res, {
    "is status 200": (r) => r.status === 200,
    "is res body has username": (r) => r.body.includes("404700003"),
  });

  get_setting();
  post_create_customer();
}

export function get_setting() {
  const url = `${host.url}/api/v1/settings?keys=Occupation`;

  const params = {
    headers: {
      usertoken: golbalsToken,
    },
  };
  const res = http.get(url, params);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}

export function post_create_customer() {
  const url = `${host.url}/api/v1/customers`;

  const payload = JSON.stringify({
    customerType: 64,
    customerSubType: 62,
    privacyPolicy: true,
    primaryContact: 243,
    phone: getRandom10DigitNumber(),
    phone2: null,
    homePhone: null,
    officePhone: null,
    gender: "F",
    salutation: "Mr",
    firstName: generateRandomString(5),
    lastName: "MSC-V2",
    personalId: null,
    passportNo: null,
    dateOfBirth: "1997-08-28",
    email: null,
    lineId: null,
    facebookProfile: null,
    note: null,
  });
  console.log(getRandom10DigitNumber());
  console.log(generateRandomString(5));

  const params = {
    headers: {
      usertoken: golbalsToken,
      "Content-Type": "application/json",
    },
  };
  const res = http.post(url, payload, params);
  console.log(res);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
