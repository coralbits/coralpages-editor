/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_WIDTH, EditorHooks } from "app/hooks/editor";
import { PageHooks } from "app/hooks/page";
import React from "react";
import settings from "app/settings";
import { showMessage } from "app/components/messages";
import { i18n } from "app/utils/i18n";
import { LinkRef, MetaRef, Page } from "app/types";
import Icon from "app/components/Icon";
import "app/webcomponent/page-preview";

// TypeScript declaration for custom web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "page-preview": {
        data?: string;
        "highlight-id"?: string;
        "hover-id"?: string;
      };
    }
  }
}

interface MainContentProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

interface PagePreviewData {
  head: string;
  html: string;
}

const MainContent = ({ page_hooks, editor_hooks }: MainContentProps) => {
  const current_base_url = window.location.origin;
  const url = `${settings.cp_url}/render/?base_url=${current_base_url}&debug=true`;
  const sequence_id = useRef(0);
  const [previewData, setPreviewData] = useState<PagePreviewData | null>(null);
  const [updateTimeout, setUpdateTimeout] = useState<any>(null);

  const fetch_page = useCallback(
    async (page: Page, this_sequence_id: number) => {
      const page_json = await render_page(url, page);
      if (!page_json) {
        return;
      }

      // ensure ordering is preserved
      if (this_sequence_id !== sequence_id.current) {
        return;
      }

      // It is a known bug that fonts loading inside a web componen does not work as expeceted. For that if we detect it might be a font, we add it (if not there yet) to the main page head.

      page_json.head.link.forEach((link: LinkRef) => {
        if (link.rel === "stylesheet" && link.href.includes("font")) {
          // check if not already there
          if (
            document.head.querySelector(
              `link[rel="${link.rel}"][href="${link.href}"]`
            )
          ) {
            return;
          }
          const link_element = document.createElement("link");
          link_element.rel = link.rel;
          link_element.href = link.href;
          document.head.appendChild(link_element);
        }
      });

      const head_html = `
        <style>${page_json.head.css}</style>
        <script>${page_json.head.js}</script>
        ${page_json.head.meta
          .map(
            (meta: MetaRef) =>
              `<meta name="${meta.name}" content="${meta.content}" />`
          )
          .join("\n")}
        ${page_json.head.link
          .map(
            (link: LinkRef) => `<link rel="${link.rel}" href="${link.href}" />`
          )
          .join("\n")}
      `;

      setPreviewData({
        head: head_html,
        html: page_json.body,
      });
    },
    [url]
  );

  useEffect(() => {
    sequence_id.current += 1;
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    setUpdateTimeout(
      setTimeout(() => {
        fetch_page(page_hooks.page!, sequence_id.current);
      }, 100)
    );
  }, [url, page_hooks.page_gen, fetch_page]);

  const highlight_id = editor_hooks.showHighlightedElements
    ? editor_hooks.selectedElementId || ""
    : "";

  return (
    <div
      className="relative flex flex-col h-full flex-1 bg-gray-800 m-auto items-center justify-center"
      id="main-content"
    >
      <div className="absolute top-3 right-3">
        <button
          className="bg-gray-700 border-amber-300 p-2 rounded-md hover:bg-amber-600 hover:cursor-pointer"
          onClick={() => {
            let max_width =
              document.getElementById("main-content")?.clientWidth;
            if (max_width !== editor_hooks.width) {
              editor_hooks.setWidth(max_width ?? 800);
            } else {
              editor_hooks.setWidth(DEFAULT_WIDTH);
            }
          }}
        >
          <Icon name="full_screen" />
        </button>
      </div>
      <div
        style={{ width: editor_hooks.width }}
        className="bg-white h-full overflow-scroll @container"
      >
        {React.createElement("page-preview", {
          data: previewData ? JSON.stringify(previewData) : "",
          "highlight-id": highlight_id,
          "hover-id": editor_hooks.hoveredElementId || "",
          "highlight-elements": editor_hooks.showHighlightedElements
            ? "true"
            : "false",
          "highlight-color": "var(--color-primary)",
        })}
      </div>
    </div>
  );
};

let last_body_sha1: string | null = null; // a one item cache, as normally one instance only, no problem.
let last_page_response: string | null = null;

const render_page = async (url: string, page: Page) => {
  const body = JSON.stringify(page);

  const body_sha1 = await get_sha1_string(body);
  if (last_body_sha1 === body_sha1) {
    return last_page_response;
  }
  last_body_sha1 = body_sha1;

  let response = await fetch(url, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let error = response.statusText;
    try {
      const error_json = await response.json();
      error = error_json.details;
    } catch (_e) {
      // ignore
    }
    showMessage(i18n("Error fetching page: {error}", { error }), {
      level: "error",
    });
    return null;
  }

  const page_json = await response.json();
  last_page_response = page_json;
  return page_json;
};

const get_sha1_string = async (body: string) => {
  const body_buffer = new TextEncoder().encode(body);
  const body_sha1 = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-1", body_buffer))
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return body_sha1;
};

export default MainContent;
