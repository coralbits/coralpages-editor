import { useEffect, useRef, useState } from "react";
import { EditorHooks } from "../hooks/editor";
import { PageHooks } from "../hooks/page";
import React from "react";
import settings from "../settings";

interface MainContentProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const html_with_injected_js = () => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <script>
window.addEventListener('message', function(event) {
  // Optionally, check event.origin for security
  if (event.data && event.data.type === 'replace-body') {
    document.body.innerHTML = event.data.html;
    document.head.innerHTML = event.data.head;
    console.log('injected html body_size=', event.data.html.length, 'head_size=', event.data.head.length);
  }
});
console.log('injected js');
</script>

  </head>
  </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  return URL.createObjectURL(blob);
};

const MainContent = ({ page_hooks, editor_hooks }: MainContentProps) => {
  const url = `${settings.pv_url}/render/`;

  useEffect(() => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(page_hooks.page),
    })
      .then((response) => response.text())
      .then((html) => {
        postHTML(html);
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

const postHTML = (html: string) => {
  const iframe = document.getElementById("pe-preview-content");
  if (!iframe) {
    return;
  }

  // extract body from html
  const body = html.match(/<body>(.*?)<\/body>/s)?.[1];
  if (!body) {
    return;
  }
  const head = html.match(/<head>(.*?)<\/head>/s)?.[1];
  if (!head) {
    return;
  }

  iframe.contentWindow?.postMessage(
    { type: "replace-body", html: body, head },
    "*",
  );
};

export default MainContent;
