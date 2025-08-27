import { Element } from "../types";
import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";
import { useState, useEffect } from "react";
import React from "react";
import { i18n } from "../utils/i18n";

interface SideBarRightProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const SideBarRight = ({ page_hooks, editor_hooks }: SideBarRightProps) => {
  const [is_dragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragStart = () => {
      setIsDragging(true);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    // Listen for drag events on the document level
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  if (!page_hooks.page) {
    return null;
  }

  return (
    <div className="sidebar sidebar-right min-w-[400px] max-w-[400px] h-full">
      <div className="sidebar-title">{page_hooks.page.title}</div>
      <div
        className="sidebar-content overflow-x-hidden max-w-full overflow-y-auto"
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          setIsDragging(false);
        }}
      >
        <DocumentItem
          editor_hooks={editor_hooks}
          child={{
            id: "root",
            type: i18n("Document Settings"),
            children: [],
          }}
          className="ml-6 my-6 h-12"
        />
        <DocumentLayout
          children={page_hooks.page.children}
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
  children?: Element[];
  editor_hooks: EditorHooks;
  is_dragging: boolean;
  page_hooks: PageHooks;
  parent_id: string;
}) => {
  return (
    <div className="flex flex-col pl-8 ">
      <DropItem
        page_hooks={page_hooks}
        parent_id={parent_id}
        idx={0}
        isVisible={is_dragging}
      />
      {children?.map((child, idx) =>
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
            <DropItem
              page_hooks={page_hooks}
              parent_id={parent_id}
              idx={idx + 1}
              isVisible={is_dragging}
            />
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
  isVisible,
}: {
  page_hooks: PageHooks;
  parent_id: string;
  idx: number;
  isVisible: boolean;
}) => {
  const [is_hovering, setIsHovering] = useState(false);
  return (
    <div
      className={`min-h-2 border-1 border-solid rounded-md transition-all duration-300 ease-in-out transform ${
        isVisible
          ? "opacity-100 max-h-8 scale-y-100"
          : "opacity-0 max-h-0 scale-y-0"
      } ${
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
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        switch (data.action) {
          case "create":
            page_hooks.onAddElement(data.element_definition, parent_id, idx);
            break;
          case "move":
            page_hooks.onMoveElement(data.element_id, parent_id, idx);
            break;
          default:
            break;
        }
        setIsHovering(false);
        // Don't reset is_dragging here - let the global dragend event handle it
      }}
    ></div>
  );
};

const DocumentItem = ({
  child,
  editor_hooks,
  className,
}: {
  child: Element;
  editor_hooks: EditorHooks;
  className?: string;
}) => {
  const is_selected =
    editor_hooks.selectedElementId &&
    child.id === editor_hooks.selectedElementId;

  return (
    <button
      className={`sidebar-button ${
        is_selected ? "sidebar-button-active" : ""
      } ${className || ""}`}
      style={{ width: "calc(100% - 2rem )" }}
      onClick={() => {
        editor_hooks.setSelectedElementId(child.id);
        editor_hooks.setSelectedTab("edit");
      }}
      draggable
      onDragStart={(e) => {
        editor_hooks.setSelectedElementId(child.id);
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({ action: "move", element_id: child.id })
        );
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {child.type}
      <span
        className={`sidebar-button-text line-clamp-1 ${
          is_selected ? "sidebar-button-text-active" : ""
        }`}
      >
        {preview_text(child)}
      </span>
    </button>
  );
};

const preview_text = (child: Element): string => {
  let text = "";
  if (child.data?.text) {
    text = child.data?.text;
  }
  if (child.data?.caption) {
    text = child.data?.caption;
  }
  text = text.split("\n")[0].slice(0, 100);

  return text;
};

export default SideBarRight;
