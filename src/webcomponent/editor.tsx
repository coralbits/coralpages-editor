/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { DialogStack } from "../components/dialog";
import { MessageStack } from "../components/messages";
import { Editor } from "../editor/Editor";
import "../index.css";
import "../agplv3-notice";

// Prevent FontAwesome from adding its CSS since we did it manually above
config.autoAddCss = false;

class PageEditorWebComponent extends HTMLElement {
  private reactRoot: Root | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "path",
      "css",
      "cp_url",
      "am_url",
      "openai_api_key",
      "openai_api_endpoint",
      "openai_model",
    ];
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if ((name === "path" || name === "css") && oldValue !== newValue) {
      console.log("attributeChangedCallback", name, oldValue, newValue);
      this.render();
    }
    if (name === "cp_url") {
      localStorage.setItem("cp_url", newValue);
    }
    if (name === "am_url") {
      localStorage.setItem("am_url", newValue);
    }
    if (name === "openai_api_key") {
      localStorage.setItem("openai_api_key", newValue);
    }
    if (name === "openai_api_endpoint") {
      localStorage.setItem("openai_api_endpoint", newValue);
    }
    if (name === "openai_model") {
      localStorage.setItem("openai_model", newValue);
    }
  }

  private async render() {
    const path = this.getAttribute("path") || "";
    const cssUrl = this.getAttribute("css");

    // Create a container div for React
    const container = document.createElement("div");
    container.style.cssText = `
      width: 100%;
      height: 100%;
      font-family: inherit;
    `;

    // Clear previous content
    this.shadowRoot!.innerHTML = "";
    this.shadowRoot!.appendChild(container);

    // Load CSS if provided
    if (cssUrl) {
      await this.loadCSS(cssUrl);
    }

    // Create React root and render
    this.reactRoot = createRoot(container);
    this.reactRoot.render(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Editor, { path }),
        React.createElement(DialogStack),
        React.createElement(MessageStack)
      )
    );
  }

  private async loadCSS(cssUrl: string): Promise<void> {
    try {
      const response = await fetch(cssUrl);
      if (!response.ok) {
        console.warn(
          `Failed to load CSS from ${cssUrl}: ${response.statusText}`
        );
        return;
      }

      const cssText = await response.text();
      const style = document.createElement("style");
      style.textContent = cssText;
      this.shadowRoot!.appendChild(style);
    } catch (error) {
      console.warn(`Error loading CSS from ${cssUrl}:`, error);
    }
  }

  // Getter for path attribute
  get path(): string {
    return this.getAttribute("path") || "";
  }

  // Setter for path attribute
  set path(value: string) {
    this.setAttribute("path", value);
  }

  // Getter for css attribute
  get css(): string {
    return this.getAttribute("css") || "";
  }

  // Setter for css attribute
  set css(value: string) {
    this.setAttribute("css", value);
  }
}

// Register the custom element
customElements.define("page-editor", PageEditorWebComponent);

export default PageEditorWebComponent;
