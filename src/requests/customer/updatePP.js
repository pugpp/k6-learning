import { check, sleep } from "k6";
import http from "k6/http";
import { host } from "../../utils/user.js";
import {
  getRandom10DigitNumber,
  generateRandomString,
} from "../../utils/helper.js";

export default class UpdatePP {
  constructor() {
    this.params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  callUpdatePP(token, profileContactCode) {
    this.params.headers.UserToken = token;
    // console.log("token:", token);
    // console.log("profileContactCode:", profileContactCode);
    let payload = JSON.stringify({
      customerType: 64,
      customerSubType: 62,
      privacyPolicy: true,
      primaryContact: 243,
      phone: getRandom10DigitNumber(),
      phone2: null,
      homePhone: null,
      officePhone: null,
      note: null,
      gender: "M",
      salutation: "คุณ",
      firstName: generateRandomString(5),
      lastName: "Update",
      personalId: null,
      passportNo: "AA12340099",
      dateOfBirth: "1991-03-03",
      email: null,
      lineId: null,
      facebookProfile: null,
      companyPrefix: null,
      companyName: null,
      profileContactCode: null,
      regId: null,
      branchTaxId: null,
      branchTaxName: null,
      occupation: 154,
      occupation1: 5073,
      occupationNote: "ขายผลไม้",
      businessTypeID1: null,
      businessTypeRemark: null,
      addresses: {
        houseNo: "199",
        moo: null,
        soi: null,
        road: "บางกรวย-ไทรน้อย",
        subDistrict: "156963",
        district: "152753",
        province: "152658",
        zipCode: "10600",
        remarks: null,
      },
      billingAddress: {
        billingAddrHouseNo: "199/128",
        billingAddrAddress: null,
        billingAddrRoomNo: null,
        billingAddrBuilding: null,
        billingAddrVillage: null,
        billingAddrSoi: null,
        billingAddrMoo: null,
        billingAddrRoad: "ถ.บางกรวย-ไทรน้อย",
        billingAddrSubDistrict: "แขวงบางลำภูล่าง",
        billingAddrDistrict: "เขตคลองสาน",
        billingAddrProvince: "จังหวัดกรุงเทพมหานคร",
        billingAddrZipCode: "10600",
        billingAddrRemarks: null,
      },
      location: {
        locationLat: "13.825619037634407",
        locationLong: "100.55856696100416",
        locationImage: "uploads/location-image.jpg",
      },
    });
    let res = http.put(
      `${host.url}/api/v1/customers/${profileContactCode}`,
      payload,
      this.params
    );
    const body = JSON.parse(res.body); // แปลง string to object
    console.log("res of updatePP :", body.customerFullName);

    check(res, {
      "is status 200": (r) => r.status === 200,
    });
    // console.log(res.body);
  }
}
