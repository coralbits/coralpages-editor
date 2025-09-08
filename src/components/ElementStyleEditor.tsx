import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";
import { useElementDefinition } from "../hooks/editor";
import ClassSelector from "./ClassSelector";
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
      <ClassSelector
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
