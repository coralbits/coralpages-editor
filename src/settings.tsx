/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { get_qs } from "./hooks/history";

export interface Settings {
  am_url: string;
  coralpages_url: string;
}

export const get_settings = () => {
  const coralpages_url =
    get_qs("coralpages_url") ||
    localStorage.getItem("coralpages_url") ||
    "/api/v1";
  const am_url =
    get_qs("am_url") || localStorage.getItem("am_url") || "/api/v1";

  if (localStorage.getItem("am_url") != am_url) {
    localStorage.setItem("am_url", am_url);
  }
  if (localStorage.getItem("coralpages_url") != coralpages_url) {
    localStorage.setItem("coralpages_url", coralpages_url);
  }

  return {
    am_url,
    coralpages_url,
  };
};

let settings: Settings = get_settings();

export default settings;
