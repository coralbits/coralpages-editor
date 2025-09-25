/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useEffect, useState, useRef } from "react";
import { Page, Element, Widget, IdName } from "../types";
import { JSONPatch } from "../utils/jsonPatch";
import settings from "../settings";
import { ResultI } from "../components/Table";
import { showMessage } from "../components/messages";
import { i18n } from "../utils/i18n";
import {
  PatchLogger,
  applyPatchesToPage,
  applyPatchToPage,
  createElementPatch,
  updateElementPatch,
  updateElementFieldPatch,
  moveElementPatch,
  deleteElementPatch,
  updatePagePatch,
  createPatch,
} from "./actions";

type setPageFn =
  | ((prev_state: Page | undefined) => Page | undefined)
  | Page
  | undefined;

export interface PageHooks {
  page?: Page;
  page_gen: number;
  findElement: (element_id?: string) => Element | undefined;
  onChangeElement: (element: Element) => void;
  onChangeElementField: (
    element_id: string,
    field: string,
    value: any,
    can_batch_merge?: boolean
  ) => void;
  onMoveElement: (element_id: string, parent_id: string, idx: number) => void;
  onCreateElement: (
    element_definition: Widget,
    parent_id: string,
    idx: number
  ) => void;
  onCreateElementAfter: (
    element_definition: Widget,
    after_element_id: string
  ) => string | undefined;
  onInsertElementAfter: (
    element: Element,
    after_element_id: string
  ) => string | undefined;
  onPatchPage: (
    op: "add" | "replace" | "remove",
    path: string,
    value: any
  ) => void;
  onDeleteElement: (element_id: string) => void;
  onUpdatePage: (page: Partial<Page>) => void;
  onDeletePage: () => Promise<boolean>;
  setPage: (pf: Page) => void;

  need_save: boolean;
  savePage: () => Promise<void>;

  // Undo/Redo functionality
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

/// In the element list (recursive) find the element by id and replace it with the new element
const children_update_element_rec = (
  elements: Element[],
  element: Element
): Element[] => {
  let found = false;
  const new_elements = elements.map((e) => {
    if (e.id === element.id) {
      found = true;
      // console.log("updating", e.id, element.id);
      return element;
    }
    if (found) {
      return e;
    }
    if (e.children) {
      return {
        ...e,
        children: children_update_element_rec(e.children, element),
      };
    }
    return e;
  });
  return new_elements;
};

const find_element_rec = (
  elements: Element[],
  element_id: string
): Element | undefined => {
  for (const element of elements) {
    if (element.id === element_id) {
      return element;
    }
    if (element.children) {
      const result = find_element_rec(element.children, element_id);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

/**
 * Finds the parent and index of an element in the page structure
 */
const find_element_parent_and_index = (
  elements: Element[],
  element_id: string,
  parent_id: string = "root"
): { parent_id: string; index: number } | undefined => {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.id === element_id) {
      return { parent_id, index: i + 1 }; // Insert after the current element
    }
    if (element.children) {
      const result = find_element_parent_and_index(
        element.children,
        element_id,
        element.id
      );
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

const usePage = (path: string): PageHooks => {
  const [page, setPageReal] = useState<Page | undefined>(undefined);
  const [page_gen, setPageGen] = useState(0);
  const [need_save, setNeedSave] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Patch logger for undo/redo
  const patchLoggerRef = useRef<PatchLogger>(new PatchLogger());
  const basePageRef = useRef<Page | undefined>(undefined);
  const currentPageRef = useRef<Page | undefined>(undefined);

  const setPage = (pf: Page) => {
    setPageReal(pf);
    currentPageRef.current = pf;
    setPageGen(page_gen + 1);
  };

  // Update undo/redo state
  const updateUndoRedoState = () => {
    setCanUndo(patchLoggerRef.current.canUndo());
    setCanRedo(patchLoggerRef.current.canRedo());
  };

  // Apply a single patch to current page
  const applyPatchToCurrentPage = (
    patch: JSONPatch,
    description?: string,
    can_batch_merge: boolean = true
  ) => {
    if (!currentPageRef.current) return;

    patchLoggerRef.current.addPatch(
      patch,
      description,
      undefined,
      can_batch_merge
    );
    const newPage = applyPatchToPage(currentPageRef.current, patch);
    setPage(newPage);
    console.log("New page", newPage);
    updateUndoRedoState();
  };

  // Apply all patches from base (used for undo/redo)
  const applyAllPatchesFromBase = () => {
    if (!basePageRef.current) return;

    const patches = patchLoggerRef.current.getPatchesUpToCurrent();
    const newPage = applyPatchesToPage(basePageRef.current, patches);
    setPage(newPage);
    updateUndoRedoState();
  };

  const onUpdatePage = (update: Partial<Page>) => {
    if (!currentPageRef.current) return;

    const patch = updatePagePatch(currentPageRef.current, update);
    applyPatchToCurrentPage(patch, "Update page");
    setNeedSave(true);
  };

  const onChangeElement = (element: Element) => {
    if (!currentPageRef.current) return;

    const patch = updateElementPatch(
      currentPageRef.current,
      element.id,
      element
    );
    applyPatchToCurrentPage(patch, `Update element ${element.id}`);
    setNeedSave(true);
  };

  const onChangeElementField = (
    element_id: string,
    field: string,
    value: any,
    can_batch_merge?: boolean
  ) => {
    if (!currentPageRef.current) return;
    if (can_batch_merge === undefined) {
      can_batch_merge = true;
    }

    const patch = updateElementFieldPatch(
      currentPageRef.current,
      element_id,
      field,
      value
    );
    applyPatchToCurrentPage(
      patch,
      `Update element ${element_id} field ${field}`,
      can_batch_merge
    );
    setNeedSave(true);
  };

  const onCreateElement = (
    element_definition: Widget,
    parent_id: string,
    index: number
  ): string | undefined => {
    if (!currentPageRef.current) return undefined;

    const element = {
      id: getRandomId(),
      widget: element_definition.name,
      data: {},
      children: [],
    };

    const patch = createElementPatch(
      currentPageRef.current,
      element,
      parent_id,
      index
    );
    applyPatchToCurrentPage(patch, `Create element ${element.widget}`);
    setNeedSave(true);
    return element.id;
  };

  const onCreateElementAfter = (
    element_definition: Widget,
    after_element_id: string
  ): string | undefined => {
    if (!currentPageRef.current) return undefined;

    // Find the parent and index of the element to insert after
    const parentInfo = find_element_parent_and_index(
      currentPageRef.current.children,
      after_element_id
    );

    if (!parentInfo) {
      // If element not found, fall back to adding at the end of root
      return onCreateElement(element_definition, "root", 10000);
    }

    // Create the new element
    const element = {
      id: getRandomId(),
      widget: element_definition.name,
      data: {},
      children: [],
    };

    const patch = createElementPatch(
      currentPageRef.current,
      element,
      parentInfo.parent_id,
      parentInfo.index
    );
    applyPatchToCurrentPage(
      patch,
      `Create element ${element.widget} after ${after_element_id}`
    );
    setNeedSave(true);
    return element.id;
  };

  const onInsertElementAfter = (
    element: Element,
    after_element_id: string
  ): string | undefined => {
    if (!currentPageRef.current) return undefined;

    // Find the parent and index of the element to insert after
    const parentInfo = find_element_parent_and_index(
      currentPageRef.current.children,
      after_element_id
    );

    let parent_id: string;
    let index: number;
    if (parentInfo) {
      parent_id = parentInfo.parent_id;
      index = parentInfo.index;
    } else {
      parent_id = "root";
      index = 10000;
    }

    const patch = createElementPatch(
      currentPageRef.current,
      element,
      parent_id,
      index
    );
    applyPatchToCurrentPage(
      patch,
      `Insert element ${element.widget} after ${after_element_id}`
    );
    setNeedSave(true);
    return element.id;
  };

  const findElement = (element_id?: string): Element | undefined => {
    if (!page || !element_id) {
      return undefined;
    }
    return find_element_rec(page.children, element_id);
  };

  const onMoveElement = (
    element_id: string,
    parent_id: string,
    idx: number
  ) => {
    if (!currentPageRef.current) return;

    const patch = moveElementPatch(
      currentPageRef.current,
      element_id,
      parent_id,
      idx
    );
    applyPatchToCurrentPage(patch, `Move element ${element_id}`);
    setNeedSave(true);
  };

  const onDeleteElement = (element_id: string) => {
    if (!currentPageRef.current) return;

    const patch = deleteElementPatch(currentPageRef.current, element_id);
    applyPatchToCurrentPage(patch, `Delete element ${element_id}`);
    setNeedSave(true);
  };

  const onPatchPage = (
    op: "add" | "replace" | "remove",
    path: string,
    value: any
  ) => {
    if (!currentPageRef.current) return;
    const patch = createPatch(op, path, value);
    applyPatchToCurrentPage(patch, `Update page ${path}`);
    setNeedSave(true);
  };

  useEffect(() => {
    fetch(`${settings.cp_url}/page/${path}`)
      .then((res) => res.json())
      .then((page) => {
        page = fix_page(page);
        const fixedPage = page as Page;

        // Store the base page and clear patch log
        basePageRef.current = fixedPage;
        patchLoggerRef.current.clear();

        setPage(fixedPage);
        setNeedSave(false);
        updateUndoRedoState();
      });
  }, [path]);

  const savePage = async () => {
    if (!page) {
      return;
    }
    const ret = await fetch(`${settings.cp_url}/page/${path}`, {
      method: "POST",
      body: JSON.stringify(page),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (ret.status !== 200) {
      let error = await ret.text();
      try {
        error = JSON.parse(error);
      } catch (e) {
        // cant parse as json, so just use the text
      }

      showMessage(
        i18n("Failed to save page - {error}", {
          error,
        }),
        { level: "error" }
      );
    } else {
      showMessage(i18n("Page saved"), { level: "info" });
      setNeedSave(false);
    }
  };

  const onDeletePage = async () => {
    if (!page) {
      return false;
    }
    const deleted = await fetch(`${settings.cp_url}/page/${path}`, {
      method: "DELETE",
    });
    if (deleted.status === 400) {
      showMessage(
        i18n("Failed to delete page - {error}", {
          error: (await deleted.json()).details,
        }),
        { level: "error" }
      );
      return false;
    }
    if (deleted.status !== 200) {
      return false;
    }
    return true;
  };

  // Undo/Redo functions
  const undo = () => {
    if (patchLoggerRef.current.undo()) {
      applyAllPatchesFromBase();
    }
  };

  const redo = () => {
    if (patchLoggerRef.current.redo()) {
      applyAllPatchesFromBase();
    }
  };

  return {
    page,
    page_gen,
    findElement,
    onUpdatePage,
    onChangeElement,
    onChangeElementField,
    onCreateElement,
    onCreateElementAfter,
    onInsertElementAfter,
    onMoveElement,
    onDeleteElement,
    onDeletePage,
    onPatchPage,
    setPage,
    savePage,
    need_save,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export function move_element({
  page,
  element_id,
  parent_id,
  idx,
}: {
  page: Page;
  element_id: string;
  parent_id: string;
  idx: number;
}): Page {
  const { element, page: new_page } = find_element_and_remove(page, element_id);
  if (!element) {
    return page;
  }

  const new_page2 = insert_element_at_idx(new_page, element, parent_id, idx);
  return new_page2;
}

export function find_element_and_remove(
  page: Page,
  element_id: string
): { element: Element | undefined; page: Page } {
  const { element, elements } = find_element_and_remove_rec(
    page.children,
    element_id
  );
  if (element) {
    return {
      element,
      page: { ...page, children: elements },
    };
  }
  return {
    element: undefined,
    page: page,
  };
}

function find_element_and_remove_rec(
  elements: Element[],
  element_id: string
): { element: Element | undefined; elements: Element[] } {
  for (const [idx, element] of elements.entries()) {
    if (element.id === element_id) {
      return {
        element,
        elements: elements.filter((e) => e.id !== element_id),
      };
    }

    if (element.children) {
      const { element: child_element, elements: child_elements } =
        find_element_and_remove_rec(element.children, element_id);
      if (child_element) {
        return {
          element: child_element,
          elements: [
            ...elements.slice(0, idx),
            { ...element, children: child_elements },
            ...elements.slice(idx + 1),
          ],
        };
      }
    }
  }
  return { element: undefined, elements: elements };
}

export function insert_element_at_idx(
  page: Page,
  element: Element,
  parent_id: string,
  idx: number
): Page {
  const children = insert_element_at_idx_rec({
    elements: page.children,
    current_id: "root",
    parent_id,
    idx,
    element,
  });
  return {
    ...page,
    children: children || [],
  };
}

function insert_element_at_idx_rec({
  element,
  elements,
  current_id,
  parent_id,
  idx,
}: {
  element: Element;
  elements?: Element[];
  current_id: string;
  parent_id: string;
  idx: number;
}): Element[] | undefined {
  if (!elements) {
    if (current_id === parent_id) {
      return [element];
    }
    return undefined;
  }

  if (current_id === parent_id) {
    const [pre, post] = [elements.slice(0, idx), elements.slice(idx)];
    return [...pre, element, ...post];
  }
  const new_elements = elements.map((e) => ({
    ...e,
    children: insert_element_at_idx_rec({
      element,
      elements: e.children,
      current_id: e.id,
      parent_id,
      idx,
    }),
  }));
  return new_elements;
}

export const useTemplateList = () => {
  const [templates, setTemplates] = useState<IdName[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const url = `${settings.cp_url}/page/?limit=100&type=template`;

      const response = await fetch(url);
      const data: ResultI<IdName> = await response.json();
      setTemplates(
        data.results.map((template: any) => ({
          id: `${template.store}/${template.id}`,
          name: template.title,
        }))
      );
    };

    fetchTemplates();
  }, []);

  return [templates];
};

export default usePage;

export function fix_page(page: Page): Page {
  return {
    ...page,
    children: page.children.map((child) => fix_element(child)),
  };
}

export function fix_element(element: Element): Element {
  let id = element.id;
  if (/^\d/.test(id)) {
    id = "a" + id;
  }
  if (id.length > 32) {
    id = id.slice(0, 32);
  }
  return {
    ...element,
    id,
  };
}

export const getRandomId = () => {
  let id = crypto.randomUUID();
  // if starts with a number, change it for 'a' + id
  if (/^\d/.test(id)) {
    id = "a" + id;
  }
  // keep it to 32 characters
  return id.slice(0, 32);
};

// Recursively clone an element, changing the id of itself and children
export function clone_element(element: Element): Element {
  return {
    ...element,
    id: getRandomId(),
    children: element.children?.map(clone_element),
  };
}
