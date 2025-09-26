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
      className="sidebar sidebar-right"
      contentClassName="sidebar-content"
      headerClassName="sidebar-title"
      buttons={[
        {
          label: i18n("Show highlighted elements"),
          icon: "highlight",
          className: editor_hooks.showHighlightedElements ? "bg-focus" : "",
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
