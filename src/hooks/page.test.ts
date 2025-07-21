import { describe, it, expect } from "vitest";
import {
  find_element_and_remove,
  insert_element_at_idx,
  move_element,
} from "./page";
import { Page } from "../types";

const EXAMPLE_PAGE: Page = {
  title: "test",
  url: "",
  children: [
    {
      id: "1",
      type: "div",
      children: [
        {
          id: "2",
          type: "div",
        },
        {
          id: "3",
          type: "div",
          children: [
            {
              id: "4",
              type: "div",
            },
          ],
        },
        {
          id: "5",
          type: "div",
        },
      ],
    },
  ],
};
describe("find_element_and_remove", () => {
  it("finds an element in a page", () => {
    const page: Page = {
      children: [
        { id: "1", type: "div" },
        { id: "2", type: "div" },
      ],
      title: "test",
    };
    const { element, page: new_page } = find_element_and_remove(page, "1");
    expect(element?.id).toEqual("1");
    expect(new_page.children).toEqual([{ id: "2", type: "div" }]);
  });

  it("finds in a complex tree", () => {
    const page: Page = EXAMPLE_PAGE;
    const { element, page: new_page } = find_element_and_remove(page, "2");
    expect(element?.id).toEqual("2");
    expect(new_page.children[0].id).toEqual("1");
    expect(new_page.children[0].children?.[0].id).toEqual("3");
    expect(new_page.children[0].children?.[1].id).toEqual("5");
  });
});

describe("insert_element_at_idx", () => {
  it("insert at root in an empty page", () => {
    const page: Page = { children: [], title: "test" };
    const element = { id: "1", type: "div" };
    const idx = 0;
    const new_page = insert_element_at_idx(page, element, "root", idx);
    expect(new_page.children).toEqual([element]);
  });

  it("insert at root in a page with one element, two and three elements", () => {
    const element1 = { id: "1", type: "div" };
    const element2 = { id: "2", type: "div" };
    const element3 = { id: "3", type: "div" };
    const element4 = { id: "4", type: "div" };
    const page: Page = { children: [element1], url: "", title: "test" };
    const idx = 0;
    const new_page = insert_element_at_idx(page, element2, "root", idx);
    expect(new_page.children).toEqual([element2, element1]);

    const new_page2 = insert_element_at_idx(new_page, element3, "root", 2);
    expect(new_page2.children).toEqual([element2, element1, element3]);

    const new_page3 = insert_element_at_idx(new_page2, element4, "root", 1);
    expect(new_page3.children).toEqual([
      element2,
      element4,
      element1,
      element3,
    ]);
  });

  it("inserts elements in a first level child", () => {
    const element1 = { id: "1", type: "div" };
    const element2 = { id: "2", type: "div" };
    const element3 = { id: "3", type: "div" };
    const element4 = { id: "4", type: "div" };
    const page: Page = { children: [element1], url: "", title: "test" };

    const new_page = insert_element_at_idx(page, element2, "1", 0);
    expect(new_page.children[0].id).toEqual("1");
    expect(new_page.children[0].children?.[0].id).toEqual("2");

    const new_page2 = insert_element_at_idx(new_page, element3, "1", 1);
    expect(new_page2.children[0].id).toEqual("1");
    expect(new_page2.children[0].children?.[0].id).toEqual("2");
    expect(new_page2.children[0].children?.[1].id).toEqual("3");

    const new_page3 = insert_element_at_idx(new_page2, element4, "1", 0);
    expect(new_page3.children[0].id).toEqual("1");
    expect(new_page3.children[0].children?.[0].id).toEqual("4");
    expect(new_page3.children[0].children?.[1].id).toEqual("2");
    expect(new_page3.children[0].children?.[2].id).toEqual("3");
  });

  it("inserts elements in a second level child, with a complex tree", () => {
    const page = EXAMPLE_PAGE;
    const element = { id: "6", type: "div" };
    const new_page = insert_element_at_idx(page, element, "1", 1);
    expect(new_page.children[0].id).toEqual("1");
    expect(new_page.children[0].children?.[0].id).toEqual("2");
    expect(new_page.children[0].children?.[1].id).toEqual("6");
    expect(new_page.children[0].children?.[2].id).toEqual("3");
    expect(new_page.children[0].children?.[2].children?.[0].id).toEqual("4");
    expect(new_page.children[0].children?.[3].id).toEqual("5");
  });
});

describe("move elements in the tree", () => {
  it("moves an element to the root", () => {
    const page = EXAMPLE_PAGE;
    const new_page = move_element({
      page,
      element_id: "2",
      parent_id: "root",
      idx: 0,
    });
    expect(new_page.children[0].id).toEqual("2");
    expect(new_page.children[1].id).toEqual("1");
    expect(new_page.children[1].children?.[0].id).toEqual("3");
    expect(new_page.children[1].children?.[1].id).toEqual("5");
  });

  it("moves an element to a child", () => {
    const page = EXAMPLE_PAGE;
    const new_page = move_element({
      page,
      element_id: "2",
      parent_id: "1",
      idx: 1,
    });
    expect(new_page.children[0].id).toEqual("1");
    expect(new_page.children[0].children?.[0].id).toEqual("3");
    expect(new_page.children[0].children?.[1].id).toEqual("2");
  });

  it("moves a deep element to the root", () => {
    const page = EXAMPLE_PAGE;
    const new_page = move_element({
      page,
      element_id: "4",
      parent_id: "root",
      idx: 0,
    });
    expect(new_page.children[0].id).toEqual("4");
    expect(new_page.children[1].id).toEqual("1");
    expect(new_page.children[1].children?.[0].id).toEqual("2");
    expect(new_page.children[1].children?.[1].id).toEqual("3");
    expect(new_page.children[1].children?.[2].id).toEqual("5");
  });
});
