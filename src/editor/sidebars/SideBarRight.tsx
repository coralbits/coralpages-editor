/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { PageHooks } from "app/hooks/page";
import { EditorHooks } from "app/hooks/editor";
import { useState, useEffect } from "react";
import { i18n } from "app/utils/i18n";
import DraggableSidebar from "app/components/DraggableSidebar";
import { DocumentLayout } from "./DocumentLayout";

interface SideBarRightProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const SideBarRight = ({ page_hooks, editor_hooks }: SideBarRightProps) => {
  const [is_floating, setIsFloating] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  return (
    <DraggableSidebar
      title={i18n("Page layout")}
      isFloating={is_floating}
      onToggleFloating={() => {
        setIsFloating(!is_floating);
        setPosition({ top: 0, left: 0 });
      }}
      position={position}
      onPositionChange={setPosition}
      className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-slate-700"
      contentClassName="flex-1 overflow-auto"
      headerClassName="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
      buttons={[
        {
          label: i18n("Show highlighted elements"),
          icon: "highlight",
          className: editor_hooks.showHighlightedElements
            ? "bg-blue-600 dark:bg-blue-500 text-white"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
          onClick: () =>
            editor_hooks.setShowHighlightedElements(
              !editor_hooks.showHighlightedElements
            ),
        },
      ]}
    >
      <DocumentLayout editor_hooks={editor_hooks} page_hooks={page_hooks} />
    </DraggableSidebar>
  );
};

export default SideBarRight;
