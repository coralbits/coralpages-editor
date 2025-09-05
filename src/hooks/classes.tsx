import { useEffect, useState } from "react";
import settings from "../settings";

export interface Class {
  name: string;
  description: string;
}

export const useClassesDefinitions = (): Class[] => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    fetch(`${settings.pv_url}/classes/`)
      .then((response) => response.json())
      .then((data) => setClasses(data.results));
  }, []);

  return classes;
};
