import TopBar from "./TopBar";
import SideBarLeft from "./SideBarLeft";
import MainContent from "./MainContent";
import SideBarRight from "./SideBarRight";
import BottomBar from "./BottomBar";
import usePage from "../hooks/page";
import { useEditor } from "../hooks/editor";

interface EditorProps {
  path: string;
  topbar?: boolean;
  preview_url?: string;
}

export const Editor = ({ path, preview_url }: EditorProps) => {
  const page_hooks = usePage(path);
  const editor_hooks = useEditor();

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
