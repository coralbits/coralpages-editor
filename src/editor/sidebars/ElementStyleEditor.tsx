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
import { useElementDefinition } from "app/hooks/editor";
import PresetClassSelector from "./PresetClassSelector";
import { ElementCssEditor } from "./ElementCssEditor";

interface ElementStyleEditorProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const ElementStyleEditor = ({
  page_hooks,
  editor_hooks,
}: ElementStyleEditorProps) => {
  const element_definition = useElementDefinition(editor_hooks, page_hooks);

  if (!element_definition) {
    return <div>No element definition found</div>;
  }

  const selected_element = page_hooks.findElement(
    editor_hooks.selectedElementId
  );

  if (!selected_element) {
    return <div>No element selected</div>;
  }

  return (
    <div>
      <PresetClassSelector
        selected_element={selected_element}
        page_hooks={page_hooks}
      />

      <hr />
      <ElementCssEditor
        selected_element={selected_element}
        page_hooks={page_hooks}
      />
    </div>
  );
};

export default ElementStyleEditor;
