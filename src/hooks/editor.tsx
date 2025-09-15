/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { Element, Widget } from "app/types";
import useElementDefinitions from "./element_definitions";
import { useEffect, useState } from "react";
import { clone_element, PageHooks } from "./page";
import { showMessage } from "app/components/messages";
import { i18n } from "app/utils/i18n";

export type EditorTab = "add" | "edit" | "style";

export const DEFAULT_WIDTH = 640;

export interface EditorHooks {
  selectedElementId: string | undefined;
  setSelectedElementId: (element_id: string | undefined) => void;
  getSelectedElement: (page_hooks: PageHooks) => Element | undefined;

  hoveredElementId: string | undefined;
  setHoveredElementId: (element_id: string | undefined) => void;
  getHoveredElement: (page_hooks: PageHooks) => Element | undefined;

  elementDefinitions: Widget[];
  selectedTab: EditorTab;
  setSelectedTab: (tab: EditorTab) => void;
  width: number;
  setWidth: (width: number) => void;

  setShowHighlightedElements: (show: boolean) => void;
  showHighlightedElements: boolean;
  pasteElement: (page_hooks: PageHooks) => void;
  pasteElementAfter: (page_hooks: PageHooks) => void;
  copyCurrentElement: (page_hooks: PageHooks) => void;
}

export const useEditor = (): EditorHooks => {
  const [selectedElementId, setSelectedElementId] = useState<
    string | undefined
  >(undefined);
  const [hoveredElementId, setHoveredElementId] = useState<string | undefined>(
    undefined
  );
  const [elementDefinitions] = useElementDefinitions();
  const [selectedTab, setSelectedTab] = useState<EditorTab>("add");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [showHighlightedElements, setShowHighlightedElements] = useState(false);
  const getSelectedElement = (page_hooks: PageHooks) => {
    return page_hooks.findElement(selectedElementId);
  };

  const getHoveredElement = (page_hooks: PageHooks) => {
    return page_hooks.findElement(hoveredElementId);
  };

  const pasteElement = async (page_hooks: PageHooks) => {
    const text = await navigator.clipboard.readText();
    let new_element: Element;
    try {
      new_element = JSON.parse(text);
    } catch (e) {
      showMessage(i18n("Invalid element"), { level: "error" });
      return;
    }
    // basic check is an element
    if (!new_element.type) {
      showMessage(i18n("Invalid element"), { level: "error" });
      return;
    }
    if (!selectedElementId) {
      showMessage(i18n("No element selected"), { level: "error" });
      return;
    }
    new_element = clone_element(new_element);
    new_element.id = selectedElementId;
    if (!new_element.id) {
      showMessage(i18n("No element id"), { level: "error" });
      return;
    }
    showMessage(i18n("Pasted from clipboard"));
    page_hooks.onChangeElement(new_element as Element);
  };

  const pasteElementAfter = async (page_hooks: PageHooks) => {
    const text = await navigator.clipboard.readText();
    let new_element: Element;
    try {
      new_element = JSON.parse(text);
    } catch (e) {
      showMessage(i18n("Invalid element"), { level: "error" });
      return;
    }
    // basic check is an element
    if (!new_element.type) {
      showMessage(i18n("Invalid element"), { level: "error" });
      return;
    }
    if (!selectedElementId) {
      showMessage(i18n("No element selected"), { level: "error" });
      return;
    }
    new_element = clone_element(new_element);

    // Insert the element after the currently selected element
    const newElementId = page_hooks.onInsertElementAfter(
      new_element,
      selectedElementId
    );

    if (newElementId) {
      showMessage(i18n("Pasted after current element"));
    } else {
      showMessage(i18n("Failed to paste element"), { level: "error" });
    }
  };

  const copyCurrentElement = (page_hooks: PageHooks) => {
    const element = page_hooks.findElement(selectedElementId);
    if (!element) {
      showMessage(i18n("No element selected"), { level: "error" });
      return;
    }
    showMessage(i18n("Copied to clipboard"));
    navigator.clipboard.writeText(JSON.stringify(element));
  };

  return {
    selectedElementId,
    setSelectedElementId,
    getSelectedElement,
    hoveredElementId,
    setHoveredElementId,
    getHoveredElement,
    elementDefinitions: elementDefinitions || [],
    selectedTab,
    setSelectedTab,
    width,
    setWidth,
    showHighlightedElements,
    setShowHighlightedElements,
    pasteElement,
    pasteElementAfter,
    copyCurrentElement,
  };
};

export const useElementDefinition = (
  editor_hooks: EditorHooks,
  page_hooks: PageHooks
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
      (definition) => definition.name === element?.type
    );
    setElementDefinition(definition);
  }, [element, editor_hooks.elementDefinitions, page_hooks.page]);
  return element_definition;
};
