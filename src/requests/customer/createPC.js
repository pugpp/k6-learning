import { check, sleep } from "k6";
import http from "k6/http";
import { host } from "../../utils/user.js";
import {
  getRandom10DigitNumber,
  generateRandomString,
} from "../../utils/helper.js";

export default class CreatePC {
  constructor() {
    this.params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  callCreatePC(token, profileContactCode) {
    this.params.headers.UserToken = token;
    // console.log("token:", token);
    // console.log("profileContactCode:", profileContactCode);
    let payload = JSON.stringify({
      customerType: 63,
      customerSubType: 59,
      privacyPolicy: true,
      primaryContact: 243,
      phone: getRandom10DigitNumber(),
      phone2: null,
      homePhone: null,
      officePhone: null,
      companyPrefix: 122204,
      companyName: generateRandomString(5),
      profileContactCode: profileContactCode,
      regId: null,
      branchTaxId: null,
      branchTaxName: null,
      note: null,
    });
    let res = http.post(`${host.url}/api/v1/customers`, payload, this.params);

    check(res, {
      "is status 200": (r) => r.status === 200,
    });
    // console.log(res.body);
  }
}
