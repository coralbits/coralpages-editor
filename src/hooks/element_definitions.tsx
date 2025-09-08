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
