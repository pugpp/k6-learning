import { check, sleep } from "k6";
import http from "k6/http";
import { host } from "../../utils/user.js";

export class GetCustomerList {
  constructor() {
    this.params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  callGetCustomerList(token) {
    this.params.headers.UserToken = token;

    let res = http.get(
      `${host.url}/api/v1/customers?segment=true&offset=0&limit=20`,
      this.params
    );
    const body = JSON.parse(res.body); // แปลง string to object
    // console.log("res of getCustomerList :", body.pagination);
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
  }
}
