import { useEffect, useRef, useState } from "react";
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
  window.addEventListener('message', function(event) {
    // Optionally, check event.origin for security
    if (event.data && event.data.type === 'replace-body') {
      document.body.innerHTML = event.data.html;
      document.head.innerHTML = event.data.head;
      console.log('injected html body_size=', event.data.html.length, 'head_size=', event.data.head.length);
    }
  });
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

  useEffect(() => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(page_hooks.page),
    })
      .then((response) => response.json())
      .then((page_json) => {
        postHTML(page_json);
      })
      .catch((error) => {
        console.error("Error fetching page:", error);
        showMessage(i18n("Error rendering page: {error}", { error }), {
          level: "error",
        });
      });
  }, [url, page_hooks.page]);

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
