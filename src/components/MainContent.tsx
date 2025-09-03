import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_WIDTH, EditorHooks } from "../hooks/editor";
import { PageHooks } from "../hooks/page";
import React from "react";
import settings from "../settings";
import { showMessage } from "./messages";
import { i18n } from "../utils/i18n";
import { Page } from "../types";
import Icon from "./Icon";

interface MainContentProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const html_with_injected_js = () => {
  const current_base_url = window.location.origin;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <base href="${current_base_url}">
  <script>
  {
  let highlight_id = undefined;
  let hover_id = undefined;
  function do_highlight(new_highlight_id) {
    if (highlight_id) {
      const element = document.querySelector("#" + highlight_id);
      if (element){
        element.style.outline = 'none';
      }
    }
    highlight_id = new_highlight_id;
    const element = document.querySelector("#" + new_highlight_id);
    if (!element) {
      return;
    }
    element.style.outline = '2px solid green';
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  function do_hover(new_hover_id) {
    if (hover_id) {
      const element = document.querySelector("#" + hover_id);
      if (element){
        element.style.backgroundColor = '';
      }
    }
    if (new_hover_id) {
      const element = document.querySelector("#" + new_hover_id);
      if (element){
        element.style.backgroundColor = '#11ee4430';
      }
    }
    hover_id = new_hover_id;
  }

  window.addEventListener('message', function(event) {
    // Optionally, check event.origin for security
    if (event.data && event.data.type === 'replace-body') {
      document.body.innerHTML = event.data.html;
      document.head.innerHTML = event.data.head;
      // console.log('injected html body_size=', event.data.html.length, 'head_size=', event.data.head.length);
      do_highlight(highlight_id);
      do_hover(hover_id);
    }
    if (event.data && event.data.type === 'highlight') {
      do_highlight(event.data.highlight_id);
    }
    if (event.data && event.data.type === 'hover') {
      do_hover(event.data.hover_id);
    }
  });
  // console.log('injected html ready');
  window.parent.postMessage({"type": "ready"}, "*")
  }
  </script>

  </head>
  </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  return URL.createObjectURL(blob);
};

const MainContent = ({ page_hooks, editor_hooks }: MainContentProps) => {
  const current_base_url = window.location.origin;
  const url = `${settings.pv_url}/render/?base_url=${current_base_url}`;
  const sequence_id = useRef(0);

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
      postHTML(page_json);
    },
    [url]
  );

  useEffect(() => {
    sequence_id.current += 1;
    fetch_page(page_hooks.page!, sequence_id.current);
  }, [url, page_hooks.page_gen, fetch_page]);

  useEffect(() => {
    sendMessageToIframe({
      type: "highlight",
      highlight_id: editor_hooks.selectedElementId,
    });
  }, [editor_hooks.selectedElementId]);
  useEffect(() => {
    sendMessageToIframe({
      type: "hover",
      hover_id: editor_hooks.hoveredElementId,
    });
  }, [editor_hooks.hoveredElementId]);

  useEffect(() => {
    const handle_ready = (event: MessageEvent) => {
      if (event.data.type !== "ready") {
        return;
      }
      fetch_page(page_hooks.page!, sequence_id.current);
    };
    window.addEventListener("message", handle_ready);
    return () => {
      window.removeEventListener("message", handle_ready);
    };
  }, [fetch_page]);

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
      <div style={{ width: editor_hooks.width }} className="bg-white h-full">
        <MyIframe />
      </div>
    </div>
  );
};

const MyIframeNoCache = () => (
  <iframe
    key="pe-preview-content"
    id="pe-preview-content"
    className="h-full w-full bg-white"
    src={html_with_injected_js()}
  />
);

const MyIframe = React.memo(MyIframeNoCache);

interface PageJson {
  title: string;
  body: string;
  head: {
    css: string;
    js: string;
    meta: string[];
  };
  http: {
    headers: Record<string, string>;
    response_code: number;
  };
}

const postHTML = (page: PageJson) => {
  if (!page) {
    return;
  }
  const head_html = `
    <style>${page.head.css}</style>
    <script>${page.head.js}</script>
    ${page.head.meta.map((meta) => `<meta ${meta} />`).join("\n")}
  `;

  sendMessageToIframe({
    type: "replace-body",
    html: page.body,
    head: head_html,
  });
};

const sendMessageToIframe = (message: any) => {
  const iframe = document.getElementById("pe-preview-content");
  if (!iframe) {
    return;
  }
  (iframe as HTMLIFrameElement).contentWindow?.postMessage(message, "*");
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
