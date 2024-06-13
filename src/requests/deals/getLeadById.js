import { check, sleep } from "k6";
import http from "k6/http";
import { host } from "../../utils/user.js";

export class GetLeadById {
  constructor() {
    this.params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  callGetLeadById(token, dealLeadId) {
    this.params.headers.UserToken = token;

    let res = http.get(
      `${host.url}/api/v1/deals/lead/${dealLeadId}`,
      this.params
    );
    const body = JSON.parse(res.body); // แปลง string to object
    // console.log("res of leadById :", body);
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
  }
}
