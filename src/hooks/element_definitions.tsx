import { useEffect, useState } from "react";
import { ElementDefinition } from "../types";

const useElementDefinitions = (api_url: string) => {
  const [elementDefinitions, setElementDefinitions] = useState<
    ElementDefinition[] | undefined
  >();

  useEffect(() => {
    fetch(`${api_url}/api/v1/element/`)
      .then((response) => response.json())
      .then((data) => setElementDefinitions(data));
  }, []);

  return [elementDefinitions];
};

export default useElementDefinitions;
