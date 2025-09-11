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
import settings from "../settings";

export interface Class {
  name: string;
  description: string;
  tags: string[];
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
    fetch(`${settings.cp_url}/classes/`)
      .then((response) => response.json())
      .then((data) => {
        classes_cache = { value: data.results };
        setClasses(classes_cache.value);
      });
  }, []);

  return classes;
};
