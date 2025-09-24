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
  cp_url: string;
}

export const get_settings = () => {
  // Handle case when running in Node.js (tests) where localStorage is not available
  const getLocalStorageItem = (key: string) => {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  };

  const setLocalStorageItem = (key: string, value: string) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  };

  const cp_url =
    get_qs("cp_url") || getLocalStorageItem("cp_url") || "/cp/api/v1";
  const am_url = get_qs("am_url") || getLocalStorageItem("am_url") || "/api/v1";

  if (getLocalStorageItem("am_url") != am_url) {
    setLocalStorageItem("am_url", am_url);
  }
  if (getLocalStorageItem("cp_url") != cp_url) {
    setLocalStorageItem("cp_url", cp_url);
  }

  return {
    am_url,
    cp_url,
  };
};

let settings: Settings = get_settings();

export default settings;
