import { useCallback, useEffect, useRef } from "react";
import { EditorHooks } from "../hooks/editor";
import { PageHooks } from "../hooks/page";
import React from "react";
import settings from "../settings";
import { showMessage } from "./messages";
import { i18n } from "../utils/i18n";

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
      console.log('injected html body_size=', event.data.html.length, 'head_size=', event.data.head.length);
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

  const fetch_page = useCallback(async () => {
    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(page_hooks.page),
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
      return;
    }

    const page_json = await response.json();
    postHTML(page_json);
  }, [url, page_hooks.page_gen]);

  useEffect(() => {
    const this_sequence_id = sequence_id.current + 1;
    sequence_id.current = this_sequence_id;
    fetch_page();
    console.log("fetch_page", page_hooks.page_gen);
  }, [url, page_hooks.page_gen, fetch_page]);

  useEffect(() => {
    const iframe = document.getElementById("pe-preview-content");
    if (!iframe) {
      return;
    }
    iframe.contentWindow?.postMessage(
      { type: "highlight", highlight_id: editor_hooks.selectedElementId },
      "*"
    );
  }, [editor_hooks.selectedElementId]);
  useEffect(() => {
    const iframe = document.getElementById("pe-preview-content");
    if (!iframe) {
      return;
    }
    iframe.contentWindow?.postMessage(
      { type: "hover", hover_id: editor_hooks.hoveredElementId },
      "*"
    );
  }, [editor_hooks.hoveredElementId]);

  return (
    <div className="flex flex-col h-full flex-1 bg-gray-800 m-auto items-center justify-center">
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
  const iframe = document.getElementById("pe-preview-content");
  if (!iframe) {
    return;
  }

  const head_html = `
    <style>${page.head.css}</style>
    <script>${page.head.js}</script>
    ${page.head.meta.map((meta) => `<meta ${meta} />`).join("\n")}
  `;

  iframe.contentWindow?.postMessage(
    { type: "replace-body", html: page.body, head: head_html },
    "*"
  );
};

export default MainContent;
