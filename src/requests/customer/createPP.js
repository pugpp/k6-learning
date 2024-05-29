import { check, sleep } from "k6";
import http from "k6/http";
import { host } from "../../utils/user.js";
import {
  getRandom10DigitNumber,
  generateRandomString,
} from "../../utils/helper.js";

export default class CreatePP {
  constructor() {
    this.params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    this.profileContactCode = "";
  }
  callCreatePP(token) {
    this.params.headers.UserToken = token;
    let payload = JSON.stringify({
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
      lastName: "Create",
      personalId: null,
      passportNo: null,
      dateOfBirth: "1997-08-28",
      email: null,
      lineId: null,
      facebookProfile: null,
      note: null,
    });
    let res = http.post(`${host.url}/api/v1/customers`, payload, this.params);
    const body = JSON.parse(res.body); // แปลง string to object
    this.profileContactCode = body.leadId;
    // console.log("profileContactCode is :", this.profileContactCode);
    console.log("res of createPP :", body.customerFullName);
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
  }
  getProfileContactCode() {
    return this.profileContactCode;
  }
}
