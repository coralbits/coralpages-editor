/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useEffect, useState } from "react";

let _setPath: (path: string) => void | undefined;

export const setPath = (path: string) => {
  // window.history.pushState({}, "", path);
  window.location.hash = path;
  _setPath?.(path);
};

export const usePath = () => {
  const [path, setPath] = useState(
    get_qs("path") || window.location.hash.slice(1)
  );
  // useEffect(() => {
  //   setPath(window.location.hash.slice(1));
  // }, [window.location.hash]);

  useEffect(() => {
    const listener = () => {
      console.log("popstate", window.location.hash.slice(1));
      setPath(window.location.hash.slice(1));
    };
    window.addEventListener("popstate", listener);
    return () => {
      window.removeEventListener("popstate", listener);
    };
  }, []);

  _setPath = setPath;

  return path;
};

export const get_qs = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

export default { setPath, usePath };
