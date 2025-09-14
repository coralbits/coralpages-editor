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
  openai_api_endpoint: string;
  openai_api_key: string;
  openai_model: string;
}

export const get_settings = () => {
  const cp_url =
    get_qs("cp_url") || localStorage.getItem("cp_url") || "/cp/api/v1";
  const am_url =
    get_qs("am_url") || localStorage.getItem("am_url") || "/api/v1";
  const openai_api_endpoint =
    get_qs("openai_api_endpoint") ||
    localStorage.getItem("openai_api_endpoint") ||
    "http://localhost:11434/v1";
  const openai_api_key =
    get_qs("openai_api_key") ||
    localStorage.getItem("openai_api_key") ||
    "deepseek-r1";
  const openai_model =
    get_qs("openai_model") ||
    localStorage.getItem("openai_model") ||
    "llama3.2";

  if (localStorage.getItem("am_url") != am_url) {
    localStorage.setItem("am_url", am_url);
  }
  if (localStorage.getItem("cp_url") != cp_url) {
    localStorage.setItem("cp_url", cp_url);
  }
  if (localStorage.getItem("openai_api_endpoint") != openai_api_endpoint) {
    localStorage.setItem("openai_api_endpoint", openai_api_endpoint);
  }
  if (localStorage.getItem("openai_api_key") != openai_api_key) {
    localStorage.setItem("openai_api_key", openai_api_key);
  }
  if (localStorage.getItem("openai_model") != openai_model) {
    localStorage.setItem("openai_model", openai_model);
  }

  return {
    am_url,
    cp_url,
    openai_api_endpoint,
    openai_api_key,
    openai_model,
  };
};

let settings: Settings = get_settings();

export default settings;
