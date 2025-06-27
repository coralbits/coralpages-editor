import React, { useState } from "react";
import TopBar from "./components/TopBar";
import SideBarLeft from "./components/SideBarLeft";
import MainContent from "./components/MainContent";
import SideBarRight from "./components/SideBarRight";
import BottomBar from "./components/BottomBar";
import usePage from "./hooks/page";
import { useEditor } from "./hooks/editor";

interface AppProps {
  api_url: string;
  page_name: string;
}

const App = ({ api_url, page_name }: AppProps) => {
  const page_hooks = usePage(api_url, page_name);
  const editor_hooks = useEditor(api_url);

  if (!page_hooks?.page || !editor_hooks.elementDefinitions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <TopBar page_hooks={page_hooks} />
      <div className="flex flex-row flex-1 overflow-hidden">
        <SideBarLeft page_hooks={page_hooks} editor_hooks={editor_hooks} />
        <MainContent page_hooks={page_hooks} editor_hooks={editor_hooks} />
        <SideBarRight page_hooks={page_hooks} editor_hooks={editor_hooks} />
      </div>
      <BottomBar />
    </div>
  );
};

export default App;
