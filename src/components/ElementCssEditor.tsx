import { useState } from "react";
import { PageHooks } from "../hooks/page";
import { Element } from "../types";
import { i18n } from "../utils/i18n";
import { FormField, FormFieldType } from "./FormField";

interface Style {
  label: string;
  type: FormFieldType;
  options?: { label: string; value: string; icon?: string }[];
  placeholder?: string;
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
      { label: "Inherit", value: "" },
      { label: "Flex", value: "flex" },
      { label: "Inline-Flex", value: "inline-flex" },
    ],
  },
  "flex-direction": {
    label: "Flex Direction",
    type: "select-buttons",
    options: [
      { label: "Row", value: "row", icon: "right" },
      { label: "Column", value: "column", icon: "down" },
    ],
  },
  "flex-grow": {
    label: "Flex Grow",
    type: "number",
  },
  "align-items": {
    label: "Align Items",
    type: "select-buttons",
    options: [
      { label: "Flex Start", value: "flex-start", icon: "up" },
      { label: "Flex End", value: "flex-end", icon: "down" },
      { label: "Center", value: "center", icon: "middle" },
      { label: "Space Between", value: "space-between", icon: "left" },
      { label: "Space Around", value: "space-around", icon: "right" },
    ],
  },
  "justify-content": {
    label: "Justify Content",
    type: "select-buttons",
    options: [
      { label: "Flex Start", value: "flex-start", icon: "up" },
      { label: "Flex End", value: "flex-end", icon: "down" },
      { label: "Center", value: "center", icon: "middle" },
      { label: "Space Between", value: "space-between", icon: "left" },
      { label: "Space Around", value: "space-around", icon: "right" },
    ],
  },
  width: {
    label: "Width",
    type: "text",
  },
  "min-width": {
    label: "Min Width",
    type: "text",
  },
  "max-width": {
    label: "Max Width",
    type: "text",
  },
  height: {
    label: "Height",
    type: "text",
  },
  "min-height": {
    label: "Min Height",
    type: "text",
  },
  "max-height": {
    label: "Max Height",
    type: "text",
  },
  "font-weight": {
    label: "Font Weight",
    type: "text",
  },
  padding: {
    label: "Padding",
    type: "text",
  },
  margin: {
    label: "Margin",
    type: "text",
  },
  border: {
    label: "Border",
    type: "text",
  },
  "border-radius": {
    label: "Border Radius",
    type: "text",
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
  "box-shadow": {
    label: "Shadow",
    type: "text",
    placeholder: "0 0 5px rgba(0, 0, 0, 0.5)",
  },
};

export const ElementCssEditor = ({
  selected_element,
  page_hooks,
}: {
  selected_element: Element;
  page_hooks: PageHooks;
}) => {
  const [search, setSearch] = useState("");

  const filtered_styles = Object.entries(styles).filter(([css_key, style]) => {
    return css_key.includes(search) || style.label.includes(search);
  });

  return (
    <div>
      <h3 className="p-2 font-bold">{i18n("Custom Style")}</h3>
      <div className="flex flex-row m-2 mb-8">
        <input
          type="text"
          className="border border-primary rounded-md p-2 self-stretch w-full"
          placeholder={i18n("Filter styles...")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        {filtered_styles.map(([css_key, style]) => (
          <EditStyleField
            key={css_key}
            style={style}
            className="p-2"
            value={selected_element.style?.[css_key] || ""}
            placeholder={style.placeholder}
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
    </div>
  );
};

const EditStyleField = ({
  style,
  className,
  value,
  setValue,
  placeholder,
}: {
  style: Style;
  className?: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
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
      placeholder={placeholder}
    />
  );
};
