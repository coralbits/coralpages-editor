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
import { Widget } from "../types";
import settings from "../settings";

const useElementDefinitions = () => {
  const [elementDefinitions, setElementDefinitions] = useState<
    Widget[] | undefined
  >();

  useEffect(() => {
    fetch(`${settings.coralpages_url}/widget/`)
      .then((response) => response.json())
      .then((data) => setElementDefinitions(data.results));
  }, []);

  return [elementDefinitions];
};

export default useElementDefinitions;
