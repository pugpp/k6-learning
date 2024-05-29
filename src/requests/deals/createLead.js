import { check, sleep } from "k6";
import http from "k6/http";
import { host } from "../../utils/user.js";
import {
  formatDate_yyyy_mm_dd,
  formatTimePlusOneHour,
} from "../../utils/helper.js";

export default class CreateLead {
  constructor() {
    this.params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    this.dealLeadId = "";
  }
  callCreateLead(token, profileContactCode) {
    this.params.headers.UserToken = token;
    let payload = JSON.stringify({
      customerTypeId: 64,
      profileCode: profileContactCode,
      profileContactCode: "",
      vehicleTypeId: 323,
      modelGroupId: 6,
      modelSubGroup1Id: 9,
      modelSubGroup2Id: 20,
      modelMasterId: null,
      note: "PPV LCV",
      purchaseTimeframeId: 1,
      socialLeadId: null,
      sourceOfLeadChannel: "Online",
      task: {
        title: "โทรติดตาม",
        followupDate: formatDate_yyyy_mm_dd(),
        followupTimeFrom: formatTimePlusOneHour(),
      },
    });
    let res = http.post(`${host.url}/api/v1/deals/lead`, payload, this.params);
    const body = JSON.parse(res.body); // แปลง string to object
    this.dealLeadId = body.dealLeadId;
    console.log("dealLeadId is :", this.dealLeadId);
    // console.log("res of createLeda :", body);
    check(res, {
      "is status 200": (r) => r.status === 200,
    });
  }
  getDealLeadId() {
    return this.dealLeadId;
  }
}
