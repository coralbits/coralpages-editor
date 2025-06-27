import { useEffect, useState } from "react";
import { EditorHooks } from "../hooks/editor";
import { PageHooks } from "../hooks/page";

interface MainContentProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const MainContent = ({ page_hooks, editor_hooks }: MainContentProps) => {
  const url = "http://localhost:8000/api/v1/render/";

  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(page_hooks.page),
    })
      .then((response) => response.text())
      .then((html) => setHtml(html));
  }, [url, page_hooks.page]);

  return (
    <div className="flex flex-col h-full flex-1 bg-gray-800 m-auto items-center justify-center">
      <div
        style={{ width: editor_hooks.width }}
        className="bg-white p-4 text-black overflow-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default MainContent;
