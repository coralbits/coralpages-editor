import { useEffect, useState } from "react";
import settings from "../settings";

export interface Class {
  name: string;
  description: string;
}

// cache the classes
let classes_cache: { value: Class[] } | undefined = undefined;

export const useClassesDefinitions = (): Class[] => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    if (classes_cache) {
      setClasses(classes_cache.value);
      return;
    }
    fetch(`${settings.pv_url}/classes/`)
      .then((response) => response.json())
      .then((data) => {
        classes_cache = { value: data.results };
        setClasses(classes_cache.value);
      });
  }, []);

  return classes;
};
