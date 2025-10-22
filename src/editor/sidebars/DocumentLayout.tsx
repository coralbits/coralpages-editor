/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { Element } from "app/types";
import { PageHooks } from "app/hooks/page";
import { EditorHooks } from "app/hooks/editor";
import { useState, useEffect } from "react";
import React from "react";
import { i18n } from "app/utils/i18n";

export interface DocumentLayoutProps {
  editor_hooks: EditorHooks;
  page_hooks: PageHooks;
}

export const DocumentLayout = ({
  editor_hooks,
  page_hooks,
}: DocumentLayoutProps) => {
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
    <div
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
          widget: i18n("Document settings"),
          children: [],
        }}
        className="ml-6 my-6 h-12"
      />
      <DocumentLayoutItems
        children={page_hooks.page?.children}
        editor_hooks={editor_hooks}
        is_dragging={is_dragging}
        page_hooks={page_hooks}
        parent_id={"root"}
      />
    </div>
  );
};

export const DocumentLayoutItems = ({
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
              <DocumentLayoutItems
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
            page_hooks.onCreateElement(data.element_definition, parent_id, idx);
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

export const DocumentItem = ({
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
    <div
      role="button"
      className={`inline-flex flex-col items-center justify-center w-full cursor-pointer transition-all duration-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-md hover:bg-white dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transform hover:-translate-y-0.5 hover:shadow-sm active:transform-none active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
        is_selected
          ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white shadow-md"
          : ""
      } ${className || ""}`}
      style={{ width: "calc(100% - 2rem )" }}
      onClick={(el) => {
        el.preventDefault();
        editor_hooks.setSelectedElementId(child.id);
        if (editor_hooks.selectedTab === "add")
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
      onMouseEnter={() => {
        editor_hooks.setHoveredElementId(child.id);
      }}
      onMouseLeave={() => {
        editor_hooks.setHoveredElementId(undefined);
      }}
    >
      {child.widget}
      <span
        className={`line-clamp-1 ${
          is_selected ? "text-white" : "text-slate-600 dark:text-slate-400"
        }`}
      >
        {preview_text(child)}
      </span>
    </div>
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
  if (child.data?.alt) {
    text = child.data?.alt;
  }
  text = text.split("\n")[0].slice(0, 100);

  return text;
};
