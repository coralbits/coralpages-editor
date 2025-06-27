import React, { useState } from "react";
import TopBar from "./components/TopBar";
import SideBarLeft from "./components/SideBarLeft";
import MainContent from "./components/MainContent";
import SideBarRight from "./components/SideBarRight";
import BottomBar from "./components/BottomBar";
import usePage from "./hooks/page";
import { PageData } from "./types";
import useElementDefinitions from "./hooks/element_definitions";

interface AppProps {
  api_url: string;
}

const App = ({ api_url }: AppProps) => {
  const [page] = usePage();
  const [selectedElement, setSelectedElement] = useState<
    PageData | undefined
  >();
  const [elementDefinitions] = useElementDefinitions(api_url);
  const [selectedTab, setSelectedTab] = useState<"add" | "edit">("add");

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar page={page} />
      <div className="flex flex-row flex-1">
        <SideBarLeft
          page={page}
          element={selectedElement}
          elementDefinitions={elementDefinitions}
          selected_tab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <MainContent page={page} />
        <SideBarRight page={page} setSelectedElement={setSelectedElement} />
      </div>
      <BottomBar />
    </div>
  );
};

export default App;
