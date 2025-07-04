import { useEffect, useState } from "react";
import { BlockTemplate } from "../types";

const useElementDefinitions = (api_url: string) => {
  const [elementDefinitions, setElementDefinitions] = useState<
    BlockTemplate[] | undefined
  >();

  useEffect(() => {
    fetch(`${api_url}/api/v1/element/`)
      .then((response) => response.json())
      .then((data) => setElementDefinitions(data));
  }, []);

  return [elementDefinitions];
};

export default useElementDefinitions;
