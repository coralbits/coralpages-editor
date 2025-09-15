/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import TopBar from "./TopBar";
import SideBarLeft from "./sidebars/SideBarLeft";
import MainContent from "./MainContent";
import SideBarRight from "./sidebars/SideBarRight";
import BottomBar from "app/components/BottomBar";
import usePage from "app/hooks/page";
import { useEditor } from "app/hooks/editor";
import { useEffect } from "react";

interface EditorProps {
  path: string;
  topbar?: boolean;
  preview_url?: string;
}

export const Editor = ({ path, preview_url }: EditorProps) => {
  const page_hooks = usePage(path);
  const editor_hooks = useEditor();

  useEffect(() => {
    const copy_handler = (e: ClipboardEvent) => {
      e.preventDefault();
      editor_hooks.copyCurrentElement(page_hooks);
    };
    const paste_handler = (e: ClipboardEvent) => {
      editor_hooks.pasteElement(page_hooks);
      e.preventDefault();
    };
    addEventListener("copy", copy_handler);
    addEventListener("paste", paste_handler);

    return () => {
      removeEventListener("copy", copy_handler);
      removeEventListener("paste", paste_handler);
    };
  }, [editor_hooks, page_hooks]);

  if (!page_hooks?.page || !editor_hooks.elementDefinitions) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col bg-primary h-full w-full">
      <TopBar page_hooks={page_hooks} preview_url={preview_url} />
      <div className="flex flex-row flex-1 overflow-hidden">
        <SideBarLeft page_hooks={page_hooks} editor_hooks={editor_hooks} />
        <MainContent page_hooks={page_hooks} editor_hooks={editor_hooks} />
        <SideBarRight page_hooks={page_hooks} editor_hooks={editor_hooks} />
      </div>
      <BottomBar />
    </div>
  );
};
