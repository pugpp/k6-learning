import Login from "../requests/loginReq.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

import { group } from "k6";
import CreatePP from "../requests/customer/createPP.js";
import CreatePC from "../requests/customer/createPC.js";
import UpdatePP from "../requests/customer/updatePP.js";
import GetCustomerList from "../requests/customer/getCustomerList.js";
import CreateLead from "../requests/deals/createLead.js";
import GetLeadById from "../requests/deals/getLeadById.js";

export let options = {
  scenarios: {
    contacts: {
      executor: "shared-iterations", // executor type
      vus: 1, //virtual user
      iterations: 1,
      maxDuration: "10m",
    },
  },
};

export default function () {
  let login = new Login();
  let getcustomerlist = new GetCustomerList();
  let createPP = new CreatePP();
  let createPC = new CreatePC();
  let updatePP = new UpdatePP();
  let createLead = new CreateLead();
  let getLeadById = new GetLeadById();

  // group("List valid users", () => {
  //   login.callLogin();
  // });

  // group("List customer", () => {
  //   login.callLogin();
  //   getcustomerlist.callGetCustomerList(login.getToken());
  // });

  // group("Create PP customer", () => {
  //   createPP.callCreatePP(login.getToken());
  // });

  // group("Create PC customer", () => {
  //   login.callLogin();
  //   createPP.callCreatePP(login.getToken());
  //   createPC.callCreatePC(login.getToken(), createPP.getProfileContactCode());
  // });

  // group("Update PP customer", () => {
  //   login.callLogin();
  //   createPP.callCreatePP(login.getToken());
  //   updatePP.callUpdatePP(login.getToken(), createPP.getProfileContactCode());
  // });

  // group("Create Lead", () => {
  //   login.callLogin();
  //   createPP.callCreatePP(login.getToken());
  //   createLead.callCreateLead(
  //     login.getToken(),
  //     createPP.getProfileContactCode()
  //   );
  // });

  group("Get lead by ID", () => {
    login.callLogin();
    createPP.callCreatePP(login.getToken());
    createLead.callCreateLead(
      login.getToken(),
      createPP.getProfileContactCode()
    );
    getLeadById.callGetLeadById(login.getToken(), createLead.getDealLeadId());
  });
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
