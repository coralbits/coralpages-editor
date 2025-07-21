import { useEffect, useState } from "react";
import { Widget } from "../types";

const useElementDefinitions = (api_url: string) => {
  const [elementDefinitions, setElementDefinitions] = useState<
    Widget[] | undefined
  >();

  useEffect(() => {
    fetch(`${api_url}/api/v1/widget/`)
      .then((response) => response.json())
      .then((data) => setElementDefinitions(data));
  }, []);

  return [elementDefinitions];
};

export default useElementDefinitions;
