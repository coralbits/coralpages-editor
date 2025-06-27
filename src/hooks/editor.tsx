import { ElementData, ElementDefinition } from "../types";
import useElementDefinitions from "./element_definitions";
import { useEffect, useState } from "react";
import { PageHooks } from "./page";

export interface EditorHooks {
  selectedElement: ElementData | undefined;
  setSelectedElement: (element: ElementData) => void;
  elementDefinitions: ElementDefinition[];
  selectedTab: "add" | "edit";
  setSelectedTab: (tab: "add" | "edit") => void;
  width: number;
  setWidth: (width: number) => void;
}

export const useEditor = (api_url: string): EditorHooks => {
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

export const useElementDefinition = (editor_hooks: EditorHooks) => {
  const [element_definition, setElementDefinition] = useState<
    ElementDefinition | undefined
  >(undefined);

  const element = editor_hooks.selectedElement;

  if (!element) {
    return undefined;
  }

  useEffect(() => {
    const definition = editor_hooks.elementDefinitions.find(
      (definition) => definition.name === element?.type
    );
    setElementDefinition(definition);
  }, [element, editor_hooks.elementDefinitions]);
  return element_definition;
};
