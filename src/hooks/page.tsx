import { useEffect, useState } from "react";
import { Page, ElementData, ElementDefinition } from "../types";
import page_json from "../state.json";

export interface PageHooks {
  page?: Page;
  findElement: (element_id?: string) => ElementData | undefined;
  onChangeElement: (element: ElementData) => void;
  onAddElement: (element_definition: ElementDefinition) => void;
  setPage: (page: Page) => void;
}

const children_update_element_rec = (
  elements: ElementData[],
  element: ElementData
): ElementData[] => {
  console.log(
    elements.map((e) => e.id),
    element.id
  );
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
  elements: ElementData[],
  element_id: string
): ElementData | undefined => {
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

const usePage = (api_url: string, page_name: string): PageHooks => {
  const [page, setPage] = useState<Page | undefined>(undefined);

  const onChangeElement = (element: ElementData) => {
    setPage((page) => {
      if (!page) {
        return page;
      }
      return {
        ...page,
        data: children_update_element_rec(page.data || [], element),
      };
    });
  };

  const onAddElement = (element_definition: ElementDefinition) => {
    const element = {
      id: crypto.randomUUID(),
      type: element_definition.name,
      data: {},
    };

    if (!page) {
      return;
    }
    const new_page = {
      ...page,
      data: [...(page.data || []), element],
    };
    setPage(new_page);
  };

  const findElement = (element_id: string): ElementData | undefined => {
    if (!page) {
      return undefined;
    }
    return find_element_rec(page.data, element_id);
  };

  useEffect(() => {
    fetch(`${api_url}/api/v1/page/${page_name}/json`)
      .then((res) => res.json())
      .then((page) => setPage(page as Page));
  }, [page_name]);

  return {
    page,
    findElement,
    onChangeElement,
    onAddElement,
    setPage,
  };
};

export default usePage;
