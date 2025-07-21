import { Element, Widget } from "../types";
import useElementDefinitions from "./element_definitions";
import { useEffect, useState } from "react";
import { PageHooks } from "./page";

export type EditorTab = "add" | "edit" | "style";

export interface EditorHooks {
  selectedElementId: string | undefined;
  setSelectedElementId: (element_id: string | undefined) => void;
  getSelectedElement: (page_hooks: PageHooks) => Element | undefined;
  elementDefinitions: Widget[];
  selectedTab: EditorTab;
  setSelectedTab: (tab: EditorTab) => void;
  width: number;
  setWidth: (width: number) => void;
}

export const useEditor = (): EditorHooks => {
  const [selectedElementId, setSelectedElementId] = useState<
    string | undefined
  >(undefined);
  const [elementDefinitions] = useElementDefinitions();
  const [selectedTab, setSelectedTab] = useState<EditorTab>("add");
  const [width, setWidth] = useState(640);

  const getSelectedElement = (page_hooks: PageHooks) => {
    return page_hooks.findElement(selectedElementId);
  };

  return {
    selectedElementId,
    setSelectedElementId,
    getSelectedElement,
    elementDefinitions: elementDefinitions || [],
    selectedTab,
    setSelectedTab,
    width,
    setWidth,
  };
};

export const useElementDefinition = (
  editor_hooks: EditorHooks,
  page_hooks: PageHooks,
) => {
  const [element_definition, setElementDefinition] = useState<
    Widget | undefined
  >(undefined);

  const element = editor_hooks.getSelectedElement(page_hooks);

  if (!element) {
    return undefined;
  }

  useEffect(() => {
    const definition = editor_hooks.elementDefinitions.find(
      (definition) => definition.name === element?.type,
    );
    setElementDefinition(definition);
  }, [element, editor_hooks.elementDefinitions, page_hooks.page]);
  return element_definition;
};
