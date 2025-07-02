import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";
import { useElementDefinition } from "../hooks/editor";

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

  const styles = [
    "color",
    "background-color",
    "width",
    "min-width",
    "max-width",
    "height",
    "min-height",
    "max-height",
    "font-size",
    "font-weight",
    "text-align",
    "margin",
    "padding",
    "border",
    "border-radius",
    "border-color",
    "border-width",
    "border-style",
    "border-top-left-radius",
  ];

  const selected_element = page_hooks.findElement(
    editor_hooks.selectedElementId
  );

  if (!selected_element) {
    return <div>No element selected</div>;
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {styles.map((css_key) => (
        <EditStyleField
          key={css_key}
          style={css_key}
          className="p-2"
          value={selected_element.style?.[css_key] || ""}
          setValue={(value) => {
            page_hooks.onChangeElement({
              ...selected_element,
              style: {
                ...selected_element.style,
                [css_key]: value,
              },
            });
          }}
        />
      ))}
    </div>
  );
};

const STYLE_EDITORS = {};

const EditStyleField = ({
  style,
  className,
  value,
  setValue,
}: {
  style: string;
  className?: string;
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-bold">{style}</label>
      <input
        type="text"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        className="w-full p-2 border border-gray-400 rounded-md"
      />
    </div>
  );
};

export default ElementStyleEditor;
