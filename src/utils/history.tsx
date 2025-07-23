import { useEffect, useState } from "react";

let _setPath: (path: string) => void | undefined;

const push = (path: string) => {
  window.history.pushState({}, "", path);
  _setPath?.(path);
};

export const usePath = () => {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    setPath(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    const listener = () => {
      setPath(window.location.pathname);
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

export default { push, usePath };
