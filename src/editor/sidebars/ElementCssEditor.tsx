/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useState } from "react";
import { PageHooks } from "app/hooks/page";
import { Element } from "app/types";
import { i18n } from "app/utils/i18n";
import { FormField, FormFieldType } from "app/components/FormField";

interface Style {
  label: string;
  type: FormFieldType;
  options?: { label: string; value: string; icon?: string }[];
  placeholder?: string;
  transform?: {
    forwards: (value: string) => string;
    backwards: (value: string) => string;
  };
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
  "background-image": {
    label: "Background Image",
    type: "image",
    transform: {
      forwards: (value) => {
        return `url(${value})`;
      },
      backwards: (value) => {
        return value.replace("url(", "").replace(")", "");
      },
    },
  },
  "background-size": {
    label: "Background Size",
    type: "select",
    options: [
      { label: "Cover", value: "cover" },
      { label: "Contain", value: "contain" },
    ],
  },
  "background-position": {
    label: "Background Position",
    type: "select",
    options: [
      { label: "Top Left", value: "top left" },
      { label: "Top Right", value: "top right" },
      { label: "Bottom Left", value: "bottom left" },
      { label: "Bottom Right", value: "bottom right" },
    ],
  },
  "background-repeat": {
    label: "Background Repeat",
    type: "select",
    options: [
      { label: "Repeat", value: "repeat" },
      { label: "No Repeat", value: "no-repeat" },
    ],
  },
  "background-attachment": {
    label: "Background Attachment",
    type: "select",
    options: [
      { label: "Scroll", value: "scroll" },
      { label: "Fixed", value: "fixed" },
    ],
  },
  "background-blend-mode": {
    label: "Background Blend Mode",
    type: "select",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Multiply", value: "multiply" },
    ],
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
  "font-size": {
    label: "Font Size",
    type: "select",
    options: [
      { label: "12px", value: "12px" },
      { label: "14px", value: "14px" },
      { label: "16px", value: "16px" },
      { label: "18px", value: "18px" },
      { label: "20px", value: "20px" },
      { label: "22px", value: "22px" },
      { label: "24px", value: "24px" },
      { label: "26px", value: "26px" },
      { label: "28px", value: "28px" },
      { label: "30px", value: "30px" },
      { label: "32px", value: "32px" },
      { label: "34px", value: "34px" },
      { label: "50px", value: "50px" },
      { label: "60px", value: "60px" },
      { label: "70px", value: "70px" },
      { label: "80px", value: "80px" },
      { label: "90px", value: "90px" },
      { label: "100px", value: "100px" },
    ],
  },
  "font-family": {
    label: "Text Font",
    type: "text",
  },
  "font-weight": {
    label: "Text Weight",
    type: "select",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Bold", value: "bold" },
      { label: "Light", value: "light" },
      { label: "Thin", value: "thin" },
      { label: "Medium", value: "medium" },
      { label: "Semi-Bold", value: "semi-bold" },
      { label: "Extra-Bold", value: "extra-bold" },
      { label: "Black", value: "black" },
      { label: "Extra-Black", value: "extra-black" },
      { label: "Extra-Light", value: "extra-light" },
    ],
  },
  "text-shadow": {
    label: "Text Shadow",
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
    if (style.type === "select") {
      return (
        css_key.includes(search) ||
        style.label.includes(search) ||
        style.options?.some(
          (option) =>
            option.label.includes(search) || option.value.includes(search)
        )
      );
    }
    if (css_key.includes(search)) return true;
    if (style.label.includes(search)) return true;
    return false;
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
  if (style.transform) {
    value = style.transform.backwards(value);
  }

  const handleChange = (value: string) => {
    if (style.transform) {
      console.log("transforming value", value);
      console.log(
        "style.transform.forwards(value)",
        style.transform.forwards(value)
      );
      setValue(style.transform.forwards(value));
    } else {
      console.log("not transforming value", value);
      setValue(value);
    }
  };

  return (
    <FormField
      className={className}
      type={style.type}
      label={style.label}
      name={style.label}
      value={value}
      options={style.options}
      onChange={(value) => handleChange(value)}
      placeholder={placeholder}
    />
  );
};
