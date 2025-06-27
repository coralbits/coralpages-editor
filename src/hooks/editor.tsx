import { ElementData, ElementDefinition } from "../types";
import useElementDefinitions from "./element_definitions";
import { useState } from "react";

export interface EditorHooks {
  selectedElement: ElementData | undefined;
  setSelectedElement: (element: ElementData) => void;
  elementDefinitions: ElementDefinition[];
  selectedTab: "add" | "edit";
  setSelectedTab: (tab: "add" | "edit") => void;
  width: number;
  setWidth: (width: number) => void;
}

const useEditor = (api_url: string): EditorHooks => {
  const [selectedElement, setSelectedElement] = useState<
    ElementData | undefined
  >();
  const [elementDefinitions] = useElementDefinitions(api_url);
  const [selectedTab, setSelectedTab] = useState<"add" | "edit">("add");
  const [width, setWidth] = useState(640);

  return {
    selectedElement,
    setSelectedElement,
    elementDefinitions: elementDefinitions || [],
    selectedTab,
    setSelectedTab,
    width,
    setWidth,
  };
};

export default useEditor;
