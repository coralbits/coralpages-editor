import TopBar from "./TopBar";
import SideBarLeft from "./SideBarLeft";
import MainContent from "./MainContent";
import SideBarRight from "./SideBarRight";
import BottomBar from "./BottomBar";
import usePage from "../hooks/page";
import { useEditor } from "../hooks/editor";

interface EditorProps {
  api_url: string;
  page_name: string;
}

export const Editor = ({ api_url, page_name }: EditorProps) => {
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
        <MainContent
          page_hooks={page_hooks}
          editor_hooks={editor_hooks}
          api_url={api_url}
        />
        <SideBarRight page_hooks={page_hooks} editor_hooks={editor_hooks} />
      </div>
      <BottomBar />
    </div>
  );
};
