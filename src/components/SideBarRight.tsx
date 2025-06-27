import { ElementData } from "../types";
import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";

interface SideBarRightProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const SideBarRight = ({ page_hooks, editor_hooks }: SideBarRightProps) => {
  if (!page_hooks.page) {
    return null;
  }

  return (
    <div className="flex flex-col bg-purple-200 min-w-[400px]">
      <div className="flex flex-col">{page_hooks.page.title}</div>
      <DocumentLayout
        children={page_hooks.page.data}
        editor_hooks={editor_hooks}
      />
    </div>
  );
};

const DocumentLayout = ({
  children,
  editor_hooks,
}: {
  children: ElementData[];
  editor_hooks: EditorHooks;
}) => {
  return (
    <div className="flex flex-col pl-8 overflow-y-auto">
      {children.map((child, idx) =>
        child.children ? (
          <details open={true} key={child.id || idx} className="">
            <summary>
              <DocumentItem child={child} editor_hooks={editor_hooks} />
            </summary>
            <DocumentLayout
              children={child.children}
              editor_hooks={editor_hooks}
            />
          </details>
        ) : (
          <div key={child.id || idx}>
            <DocumentItem child={child} editor_hooks={editor_hooks} />
          </div>
        )
      )}
    </div>
  );
};

const DocumentItem = ({
  child,
  editor_hooks,
}: {
  child: ElementData;
  editor_hooks: EditorHooks;
}) => {
  const is_selected =
    editor_hooks.selectedElement &&
    child.id === editor_hooks.selectedElement.id;

  return (
    <button
      className={`inline-blockw-full text-left cursor-pointer hover:bg-purple-500 active:bg-purple-400 transition-colors ${
        is_selected ? "bg-purple-500" : ""
      }`}
      onClick={() => {
        editor_hooks.setSelectedElement(child);
        editor_hooks.setSelectedTab("edit");
      }}
    >
      {child.type}
      <span
        className={`text-xs text-gray-500 pl-2 truncate hover:text-white ${
          is_selected ? "text-white" : ""
        }`}
      >
        {child.data?.title || child.data?.text}
      </span>
    </button>
  );
};

export default SideBarRight;
