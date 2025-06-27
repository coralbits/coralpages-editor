import { EditorHooks } from "../hooks/editor";
import { PageHooks } from "../hooks/page";

interface MainContentProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const MainContent = ({ page_hooks, editor_hooks }: MainContentProps) => {
  const url = "http://localhost:8000/api/v1/view/architecture";

  return (
    <div className="flex flex-col h-full flex-1 bg-gray-800 m-auto items-center justify-center">
      <pre
        style={{ width: editor_hooks.width }}
        className="bg-white p-4 text-black overflow-auto"
      >
        {JSON.stringify(page_hooks.page, null, 2)}
      </pre>
    </div>
  );
};

export default MainContent;
