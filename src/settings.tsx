import { get_qs } from "./utils/history";

export interface Settings {
  am_url: string;
  pv_url: string;
}

export const get_settings = () => {
  const pv_url =
    get_qs("pv_url") || localStorage.getItem("pv_url") || "/api/v1";
  const am_url =
    get_qs("am_url") || localStorage.getItem("am_url") || "/api/v1";

  if (localStorage.getItem("am_url") != am_url) {
    localStorage.setItem("am_url", am_url);
  }
  if (localStorage.getItem("pv_url") != pv_url) {
    localStorage.setItem("pv_url", pv_url);
  }

  return {
    am_url,
    pv_url,
  };
};

let settings: Settings = get_settings();

export default settings;
