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
    return ["data", "highlight-id", "hover-id"];
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
      }
    }
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

  private highlightElement(elementId: string | undefined) {
    // Remove previous highlight
    if (this.highlightId_) {
      const element = this.shadowRoot?.querySelector(`#${this.highlightId_}`);
      if (element) {
        (element as HTMLElement).style.outline = "none";
      }
    }

    this.highlightId_ = elementId;

    // Apply new highlight
    if (elementId) {
      const element = this.shadowRoot?.querySelector(`#${elementId}`);
      if (element) {
        (element as HTMLElement).style.outline = "2px solid green";
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
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

  private render() {
    if (!this.shadowRoot) return;

    // get current scroll position
    const scrollTop = this.parentElement?.scrollTop || window.scrollY;
    const scrollLeft = this.parentElement?.scrollLeft || window.scrollX;

    const html = `
        ${this.currentData?.head || ""}
        ${this.currentData?.html || "Loading..."}
    `;

    // Clear previous content
    this.shadowRoot.innerHTML = html;

    // Reapply highlighting and hovering after content loads
    if (this.highlightId_) {
      this.highlightElement(this.highlightId_);
    }
    if (this.hoverId_) {
      this.hoverElement(this.hoverId_);
    }

    // restore scroll position
    this.parentElement?.scrollTo(scrollLeft, scrollTop);
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
