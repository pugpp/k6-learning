import Login from "../requests/loginReq.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

import { group } from "k6";
import CreatePP from "../requests/createPP.js";

export let options = {
  scenarios: {
    contacts: {
      executor: "shared-iterations", // executor type
      vus: 1, //virtual user
      iterations: 10,
      maxDuration: "10m",
    },
  },
};

export default function () {
  let login = new Login();
  let createPP = new CreatePP();

  group("List valid users", () => {
    login.callLogin();
  });
  group("Create PP customer", () => {
    createPP.callCreatePP(login.getToken());
  });
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
