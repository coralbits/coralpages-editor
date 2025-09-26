/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

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

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    console.log(
      "Coralpages Editor Web Component by Coralbits SL. Under AGPLv3 License. https://www.coralbits.com/coralpages/"
    );
    console.log(
      "Beware of embdding this component in non AGPLv3 pages as thay may be a breach of license."
    );
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
          this.highlightElements();
          break;
        case "highlight-color":
          this.highlightColor_ = newValue || "var(--color-primary)";
          this.highlightElement(this.highlightId_);
          this.highlightElements();
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
`;
  }

  private updateData() {
    console.log("PagePreviewWebComponent updateData");
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

  /** Highlight all components with a dashed outline */
  private highlightElements() {
    const elements = this.shadowRoot?.querySelectorAll("[id]");
    if (elements) {
      elements.forEach((element) => {
        (
          element as HTMLElement
        ).style.outline = `1px dashed ${this.highlightColor_}`;
      });
    }
  }

  private highlightElement(elementId: string | undefined) {
    // Remove previous highlight
    if (this.highlightId_) {
      const element = this.shadowRoot?.querySelector(`#${this.highlightId_}`);
      if (element) {
        (element as HTMLElement).style.outline = "none";
        (element as HTMLElement).classList.remove("visible");
      }
    }

    this.highlightId_ = elementId;

    // Apply new highlight
    if (!elementId) {
      console.log("No element id to highlight");
      return;
    }
    const element = this.shadowRoot?.querySelector(`#${elementId}`);
    if (!element) {
      console.log("No element to highlight");
      return;
    }
    const selected_area_element = this.selected_area_element_;
    if (!selected_area_element) {
      console.log("No selected area element");
      return;
    }
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
    const element_margins_width =
      remove_px(element_style.marginLeft) +
      remove_px(element_style.marginRight) -
      4;
    const element_margins_height =
      remove_px(element_style.marginTop) +
      remove_px(element_style.marginBottom) -
      4;

    selected_area_element.style.top = element_pos.top - preview_pos.top + "px";
    selected_area_element.style.left =
      element_pos.left - preview_pos.left + "px";

    selected_area_element.style.width =
      element_pos.width + element_margins_width + "px";
    selected_area_element.style.height =
      element_pos.height + element_margins_height + "px";

    selected_area_element.classList.add("visible");

    console.log("element_margins_width", selected_area_element.style);
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

  private render() {
    if (!this.shadowRoot) return;
    this.root_ = this.shadowRoot.host as HTMLElement | null;

    // get current scroll position
    const scrollTop = this.root_?.scrollTop || window.scrollY;
    const scrollLeft = this.root_?.scrollLeft || window.scrollX;

    const html = `
        <style>${this.getCSS()}</style>
        ${this.currentData?.head || ""}
        ${this.currentData?.html || "Loading..."}
    `;

    // Clear previous content
    this.shadowRoot.innerHTML = html;

    // Create new selection area element
    this.selected_area_element_ = this.createSelectionAreaElement();
    this.shadowRoot.appendChild(this.selected_area_element_);

    // Reapply highlighting and hovering after content loads
    if (this.highlightElements_) {
      this.highlightElements();
    }
    if (this.highlightId_) {
      this.highlightElement(this.highlightId_);
    }
    if (this.hoverId_) {
      this.hoverElement(this.hoverId_);
    }

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
