import { check, sleep } from "k6";
import http from "k6/http";
import { host } from "../utils/user.js";

export default class login {
  constructor() {
    this.params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    this.token = "";
  }

  callLogin() {
    if (this.token !== "") return;
    let payload = JSON.stringify({
      username: host.username,
      password: host.password,
    });
    let res = http.post(`${host.url}/api/v1/login`, payload, this.params);
    if (res.status == 200) {
      const body = JSON.parse(res.body); // แปลง string to object
      this.token = body.UserToken;
      // console.log("golbalsToken is : ", this.token);
    }
    sleep(2); // delay before sent req again because if not delay it will be same like user press f5
    check(res, {
      "is status 200": (r) => r.status === 200,
      "is res body has username": (r) => r.body.includes("404700003"),
    });



  }
  getToken() {
    return this.token;
  }
}
