/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

/**
 * Utility class for observing document theme changes and applying them to web components
 */
export class DocumentThemeObserver {
  private classObserver: MutationObserver | null = null;
  private targetElement: HTMLElement | null = null;
  private themeAttribute: string | null = null;

  constructor(targetElement: HTMLElement, themeAttribute?: string | null) {
    this.targetElement = targetElement;
    this.themeAttribute = themeAttribute || null;
  }

  /**
   * Start watching for document class changes
   */
  startWatching(): void {
    if (this.classObserver) {
      return; // Already watching
    }

    this.classObserver = new MutationObserver((mutations) => {
      let shouldUpdateTheme = false;

      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target as Element;
          if (target === document.documentElement) {
            shouldUpdateTheme = true;
          }
        }
      });

      if (shouldUpdateTheme) {
        this.updateTheme();
      }
    });

    this.classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  /**
   * Stop watching for document class changes
   */
  stopWatching(): void {
    if (this.classObserver) {
      this.classObserver.disconnect();
      this.classObserver = null;
    }
  }

  /**
   * Update the theme class on the target element
   */
  updateTheme(): void {
    if (!this.targetElement) return;

    const theme = this.getThemeFromDocument();

    // Remove existing theme classes
    this.targetElement.classList.remove("light", "dark");

    // Add new theme class
    this.targetElement.classList.add(theme);
  }

  /**
   * Apply initial theme to the target element
   */
  applyInitialTheme(): void {
    if (!this.targetElement) return;

    const theme = this.getThemeFromDocument();
    this.targetElement.classList.add(theme);
  }

  /**
   * Get the current theme from document or attribute
   */
  private getThemeFromDocument(): string {
    // Check if we have a theme attribute set
    if (this.themeAttribute) {
      return this.themeAttribute;
    }

    // Fall back to document class detection
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }

  /**
   * Update the theme attribute (useful when the web component's theme attribute changes)
   */
  setThemeAttribute(theme: string | null | undefined): void {
    this.themeAttribute = theme || null;
    this.updateTheme();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopWatching();
    this.targetElement = null;
    this.themeAttribute = null;
  }
}
