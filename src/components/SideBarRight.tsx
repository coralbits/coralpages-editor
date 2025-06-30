import { ElementData } from "../types";
import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";
import { useState } from "react";
import React from "react";

interface SideBarRightProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const SideBarRight = ({ page_hooks, editor_hooks }: SideBarRightProps) => {
  const [is_dragging, setIsDragging] = useState(false);

  if (!page_hooks.page) {
    return null;
  }

  return (
    <div className="sidebar sidebar-right min-w-[400px] max-w-[400px]">
      <div className="sidebar-title">{page_hooks.page.title}</div>
      <div
        className="sidebar-content overflow-x-hidden max-w-full overflow-y-auto"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          setIsDragging(false);
        }}
        onDrop={(e) => {
          setIsDragging(false);
        }}
      >
        <DocumentLayout
          children={page_hooks.page.data}
          editor_hooks={editor_hooks}
          is_dragging={is_dragging}
          page_hooks={page_hooks}
          parent_id={"root"}
        />
      </div>
    </div>
  );
};

const DocumentLayout = ({
  children,
  editor_hooks,
  is_dragging,
  page_hooks,
  parent_id,
}: {
  children: ElementData[];
  editor_hooks: EditorHooks;
  is_dragging: boolean;
  page_hooks: PageHooks;
  parent_id: string;
}) => {
  return (
    <div className="flex flex-col pl-8 ">
      {is_dragging && (
        <DropItem page_hooks={page_hooks} parent_id={parent_id} idx={0} />
      )}
      {children.map((child, idx) =>
        child.children ? (
          <React.Fragment key={child.id || idx}>
            <details open={true} key={child.id || idx} className="w-full">
              <summary className="w-full px-2">
                <DocumentItem child={child} editor_hooks={editor_hooks} />
              </summary>
              <DocumentLayout
                children={child.children}
                editor_hooks={editor_hooks}
                is_dragging={is_dragging}
                page_hooks={page_hooks}
                parent_id={child.id!}
              />
            </details>
            {is_dragging && (
              <DropItem
                page_hooks={page_hooks}
                parent_id={parent_id}
                idx={idx + 1}
              />
            )}
          </React.Fragment>
        ) : (
          <div key={child.id || idx}>
            <DocumentItem child={child} editor_hooks={editor_hooks} />
          </div>
        )
      )}
    </div>
  );
};

const DropItem = ({
  page_hooks,
  parent_id,
  idx,
}: {
  page_hooks: PageHooks;
  parent_id: string;
  idx: number;
}) => {
  const [is_hovering, setIsHovering] = useState(false);
  return (
    <div
      className={`min-h-4   border-1 border-solid  rounded-md ${
        is_hovering
          ? "bg-green-500/50 border-green-500"
          : "bg-amber-500/25 border-amber-500"
      }`}
      onDragEnter={() => setIsHovering(true)}
      onDragLeave={() => setIsHovering(false)}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const element_id = e.dataTransfer.getData("text/plain");
        page_hooks.onMoveElement(element_id, parent_id, idx);
        setIsHovering(false);
      }}
    ></div>
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
    editor_hooks.selectedElementId &&
    child.id === editor_hooks.selectedElementId;

  return (
    <button
      className={`sidebar-button ${is_selected ? "sidebar-button-active" : ""}`}
      style={{ width: "calc(100% - 2rem )" }}
      onClick={() => {
        editor_hooks.setSelectedElementId(child.id);
        editor_hooks.setSelectedTab("edit");
      }}
      draggable
      onDragStart={(e) => {
        editor_hooks.setSelectedElementId(child.id);
        e.dataTransfer.setData("text/plain", child.id!);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {child.type}
      <span
        className={`sidebar-button-text ${
          is_selected ? "sidebar-button-text-active" : ""
        }`}
      >
        {child.data?.title || child.data?.text}
      </span>
    </button>
  );
};

export default SideBarRight;
