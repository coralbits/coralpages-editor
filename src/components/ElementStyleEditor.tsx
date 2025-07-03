import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";
import { useElementDefinition } from "../hooks/editor";
import { FormField, FormFieldType } from "./FormField";

interface Style {
  label: string;
  type: FormFieldType;
  options?: { label: string; value: string }[];
}

const styles: Record<string, Style> = {
  color: {
    label: "Color",
    type: "color",
  },
  "background-color": {
    label: "Background Color",
    type: "color",
  },
  "text-align": {
    label: "Text Align",
    type: "select",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ],
  },
  display: {
    label: "Display",
    type: "select",
    options: [
      { label: "Flex", value: "flex" },
      { label: "Inline-Flex", value: "inline-flex" },
    ],
  },
  "flex-direction": {
    label: "Flex Direction",
    type: "select",
    options: [
      { label: "Row", value: "row" },
      { label: "Column", value: "column" },
    ],
  },
  "align-items": {
    label: "Align Items",
    type: "select",
    options: [
      { label: "Flex Start", value: "flex-start" },
      { label: "Flex End", value: "flex-end" },
      { label: "Center", value: "center" },
      { label: "Space Between", value: "space-between" },
      { label: "Space Around", value: "space-around" },
    ],
  },
  "justify-content": {
    label: "Justify Content",
    type: "select",
    options: [
      { label: "Flex Start", value: "flex-start" },
      { label: "Flex End", value: "flex-end" },
      { label: "Center", value: "center" },
      { label: "Space Between", value: "space-between" },
      { label: "Space Around", value: "space-around" },
    ],
  },
  width: {
    label: "Width",
    type: "number",
  },
  "min-width": {
    label: "Min Width",
    type: "number",
  },
  "max-width": {
    label: "Max Width",
    type: "number",
  },
  height: {
    label: "Height",
    type: "number",
  },
  "min-height": {
    label: "Min Height",
    type: "number",
  },
  "max-height": {
    label: "Max Height",
    type: "number",
  },
  "font-weight": {
    label: "Font Weight",
    type: "number",
  },
  padding: {
    label: "Padding",
    type: "number",
  },
  border: {
    label: "Border",
    type: "number",
  },
  "border-radius": {
    label: "Border Radius",
    type: "number",
  },
  "border-color": {
    label: "Border Color",
    type: "color",
  },
  "border-style": {
    label: "Border Style",
    type: "select",
    options: [
      { label: "Solid", value: "solid" },
      { label: "Dashed", value: "dashed" },
      { label: "Dotted", value: "dotted" },
      { label: "Double", value: "double" },
      { label: "Groove", value: "groove" },
      { label: "Ridge", value: "ridge" },
      { label: "Inset", value: "inset" },
      { label: "Outset", value: "outset" },
    ],
  },
};

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
    <div className="flex flex-col gap-2">
      {Object.entries(styles).map(([css_key, style]) => (
        <EditStyleField
          key={css_key}
          style={style}
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

const EditStyleField = ({
  style,
  className,
  value,
  setValue,
}: {
  style: Style;
  className?: string;
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <FormField
      className={className}
      type={style.type}
      label={style.label}
      name={style.label}
      value={value}
      options={style.options}
      onChange={(value) => setValue(value)}
    />
  );
};

export default ElementStyleEditor;
