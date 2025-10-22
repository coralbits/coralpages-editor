/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import "../agplv3-notice";

interface PagePreviewData {
  head: string;
  html: string;
}

class PagePreviewWebComponent extends HTMLElement {
  private highlightId_: string | undefined = undefined;
  private hoverId_: string | undefined = undefined;
  private currentData: PagePreviewData | null = null;
  private highlightElements_: boolean = true;
  private highlightColor_: string = "red";
  private selected_area_element_: HTMLElement | null = null;
  private root_: HTMLElement | null = null;
  private preview_element_: HTMLElement | null = null; // this is where the preview is actually rendered

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "data",
      "highlight-id",
      "hover-id",
      "highlight-elements",
      "highlight-color",
    ];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      switch (name) {
        case "data":
          this.updateData();
          break;
        case "highlight-id":
          this.highlightElement(newValue || undefined);
          break;
        case "hover-id":
          this.hoverElement(newValue || undefined);
          break;
        case "highlight-elements":
          this.highlightElements_ = newValue === "true";
          if (this.highlightElements_) {
            this.preview_element_?.classList.add("show-highlighted-elements");
            this.selected_area_element_?.classList.add("visible");
          } else {
            this.preview_element_?.classList.remove(
              "show-highlighted-elements"
            );
            this.selected_area_element_?.classList.remove("visible");
          }
          break;
        case "highlight-color":
          this.highlightColor_ = newValue || "var(--color-primary)";
          this.highlightElement(this.highlightId_);
          break;
      }
    }
  }

  private getCSS() {
    return `
#_selection_area_element_ {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: transparent;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}

#_selection_area_element_.visible {
  opacity: 1;
}
div.show-highlighted-elements#_preview_element_ [id] {
  outline: 1px dashed ${this.highlightColor_};
}
`;
  }

  private updateData() {
    // console.log("PagePreviewWebComponent updateData");
    const dataAttr = this.getAttribute("data");
    if (dataAttr) {
      try {
        const data = JSON.parse(dataAttr) as PagePreviewData;
        this.currentData = data;
        this.render();
      } catch (error) {
        console.error("Failed to parse data attribute:", error);
      }
    }
  }

  private highlightElement(elementId: string | undefined) {
    this.highlightId_ = elementId;

    const selected_area_element = this.selected_area_element_;
    if (!selected_area_element) {
      // console.log("No selected area element");
      return;
    }
    // Apply new highlight
    if (!elementId) {
      // console.log("No element id to highlight");
      selected_area_element.classList.remove("visible");
      return;
    }
    const element = this.shadowRoot?.querySelector(`#${elementId}`);
    if (!element) {
      // console.log("No element to highlight");
      return;
    }
    // Check we are in the area, if not scroll into it. At this.root_ level.
    // Make it work even if the selected_area_element is not visible
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });

    const preview_element = this.root_;
    if (!preview_element) {
      console.log("No preview element");
      return;
    }
    function remove_px(value: string) {
      return Number(value.replace("px", ""));
    }

    const preview_pos = preview_element.getBoundingClientRect();
    const element_pos = element.getBoundingClientRect();
    const element_style = getComputedStyle(element);
    const element_margins_left = remove_px(element_style.marginLeft);
    const element_margins_right = remove_px(element_style.marginRight);
    const element_margins_top = remove_px(element_style.marginTop);
    const element_margins_bottom = remove_px(element_style.marginBottom);

    const new_top = element_pos.top - preview_pos.top - element_margins_top;
    const new_left = element_pos.left - preview_pos.left - element_margins_left;
    const new_width =
      element_pos.width + element_margins_left + element_margins_right - 4;
    const new_height =
      element_pos.height + element_margins_top + element_margins_bottom - 4;

    selected_area_element.style.top = new_top + "px";
    selected_area_element.style.left = new_left + "px";
    selected_area_element.style.width = new_width + "px";
    selected_area_element.style.height = new_height + "px";

    if (this.highlightElements_) {
      selected_area_element.classList.add("visible");
    }
  }

  private hoverElement(elementId: string | undefined) {
    // Remove previous hover
    if (this.hoverId_) {
      const element = this.shadowRoot?.querySelector(`#${this.hoverId_}`);
      if (element) {
        (element as HTMLElement).style.backgroundColor = "";
      }
    }

    this.hoverId_ = elementId;

    // Apply new hover
    if (elementId) {
      const element = this.shadowRoot?.querySelector(`#${elementId}`);
      if (element) {
        (element as HTMLElement).style.backgroundColor = "#11ee4430";
      }
    }
  }

  private createSelectionAreaElement() {
    const element = document.createElement("div");
    element.id = "_selection_area_element_";
    element.style.border = `2px solid ${this.highlightColor_}`;
    return element;
  }

  private render_root() {
    if (!this.shadowRoot) return;
    this.root_ = this.shadowRoot.host as HTMLElement | null;
    if (!this.root_) return;

    const style_element_ = document.createElement("style");
    style_element_.textContent = this.getCSS();
    this.shadowRoot.appendChild(style_element_);

    this.selected_area_element_ = this.createSelectionAreaElement();
    this.selected_area_element_.style.width = "100%";
    this.selected_area_element_.style.height = "100%";
    this.shadowRoot.appendChild(this.selected_area_element_);

    this.preview_element_ = document.createElement("div");
    if (this.highlightElements_) {
      this.preview_element_.classList.add("show-highlighted-elements");
    }
    this.preview_element_.id = "_preview_element_";
    this.shadowRoot.appendChild(this.preview_element_);
  }

  private render() {
    if (!this.shadowRoot) return;
    if (!this.preview_element_) {
      this.render_root();
    }
    if (!this.preview_element_) return;

    // get current scroll position
    const scrollTop = this.root_?.scrollTop || window.scrollY;
    const scrollLeft = this.root_?.scrollLeft || window.scrollX;

    const html = `
        ${this.currentData?.head || ""}
        ${this.currentData?.html || "Loading..."}
    `;

    // Clear previous content
    this.preview_element_.innerHTML = html;

    // restore scroll position
    this.root_?.scrollTo(scrollLeft, scrollTop);
  }

  // Getter for data attribute
  get data(): string {
    return this.getAttribute("data") || "";
  }

  // Setter for data attribute
  set data(value: string) {
    this.setAttribute("data", value);
  }

  // Getter for highlight-id attribute
  get highlightId(): string {
    return this.getAttribute("highlight-id") || "";
  }

  // Setter for highlight-id attribute
  set highlightId(value: string) {
    this.setAttribute("highlight-id", value);
  }

  // Getter for hover-id attribute
  get hoverId(): string {
    return this.getAttribute("hover-id") || "";
  }

  // Setter for hover-id attribute
  set hoverId(value: string) {
    this.setAttribute("hover-id", value);
  }
}

// Register the custom element
customElements.define("page-preview", PagePreviewWebComponent);

export default PagePreviewWebComponent;
