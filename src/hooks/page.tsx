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
import { Page, Element, Widget, IdName } from "../types";
import settings from "../settings";
import { ResultI } from "../components/Table";
import { showMessage } from "../components/messages";
import { i18n } from "../utils/i18n";

type setPageFn =
  | ((prev_state: Page | undefined) => Page | undefined)
  | Page
  | undefined;

export interface PageHooks {
  page?: Page;
  page_gen: number;
  findElement: (element_id?: string) => Element | undefined;
  onChangeElement: (element: Element) => void;
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
  onDeleteElement: (element_id: string) => void;
  onUpdatePage: (page: Partial<Page>) => void;
  onDeletePage: () => Promise<boolean>;
  setPage: (setPageFn: setPageFn) => void;

  need_save: boolean;
  savePage: () => Promise<void>;
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
      console.log("updating", e.id, element.id);
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

  const setPage = (pf: setPageFn) => {
    setPageReal(pf);
    setPageGen(page_gen + 1);
  };

  const onUpdatePage = (update: Partial<Page>) => {
    setPage((page) => {
      if (!page) {
        return page;
      }
      setNeedSave(true);
      return {
        ...page,
        ...update,
      };
    });
  };

  const onChangeElement = (element: Element) => {
    setPage((page) => {
      if (!page) {
        return page;
      }
      setNeedSave(true);
      return {
        ...page,
        children: children_update_element_rec(page.children || [], element),
      };
    });
  };

  const onAddElement = (
    element_definition: Widget,
    parent_id: string,
    index: number
  ): string | undefined => {
    const element = {
      id: getRandomId(),
      type: element_definition.name,
      data: {},
      children: [],
    };

    if (!page) {
      return undefined;
    }

    setPage((page) => {
      if (!page) {
        return page;
      }

      const new_page = insert_element_at_idx(page, element, parent_id, index);
      setNeedSave(true);
      return new_page;
    });
    return element.id;
  };

  const onAddElementAfter = (
    element_definition: Widget,
    after_element_id: string
  ): string | undefined => {
    if (!page) {
      return undefined;
    }

    // Find the parent and index of the element to insert after
    const parentInfo = find_element_parent_and_index(
      page.children,
      after_element_id
    );

    if (!parentInfo) {
      // If element not found, fall back to adding at the end of root
      onAddElement(element_definition, "root", 10000);
      return undefined;
    }

    // Create the new element
    const element = {
      id: getRandomId(),
      type: element_definition.name,
      data: {},
      children: [],
    };

    setPage((page) => {
      if (!page) {
        return page;
      }

      const new_page = insert_element_at_idx(
        page,
        element,
        parentInfo.parent_id,
        parentInfo.index
      );
      setNeedSave(true);
      return new_page;
    });

    return element.id;
  };

  const onInsertElementAfter = (
    element: Element,
    after_element_id: string
  ): string | undefined => {
    if (!page) {
      return undefined;
    }

    // Find the parent and index of the element to insert after
    const parentInfo = find_element_parent_and_index(
      page.children,
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

    setPage((page) => {
      if (!page) {
        return page;
      }

      const new_page = insert_element_at_idx(page, element, parent_id, index);
      setNeedSave(true);
      return new_page;
    });

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
    setPage((page) => {
      if (!page) {
        return page;
      }
      const new_page = move_element({
        page,
        element_id,
        parent_id,
        idx,
      });
      setNeedSave(true);
      return new_page;
    });
  };

  const onDeleteElement = (element_id: string) => {
    setPage((page) => {
      if (!page) {
        return page;
      }
      const { element, page: new_page } = find_element_and_remove(
        page,
        element_id
      );
      if (!element) {
        return page;
      }
      setNeedSave(true);
      return new_page;
    });
  };

  useEffect(() => {
    fetch(`${settings.cp_url}/page/${path}`)
      .then((res) => res.json())
      .then((page) => {
        page = fix_page(page);
        setPage(page as Page);
        setNeedSave(false);
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

  return {
    page,
    page_gen,
    findElement,
    onUpdatePage,
    onChangeElement,
    onCreateElement: onAddElement,
    onCreateElementAfter: onAddElementAfter,
    onInsertElementAfter,
    onMoveElement,
    onDeleteElement,
    onDeletePage,
    setPage,
    savePage,
    need_save,
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
