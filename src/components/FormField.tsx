/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { AssetSelectorButton } from "./AssetSelector";
import Icon from "./Icon";

export type FormFieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "color"
  | "range"
  | "image"
  | "hidden"
  | "boolean"
  | "select-buttons"
  | "description";

export interface FormFieldProps {
  className?: string;
  type: FormFieldType;
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  options?: { label: string; value: string; icon?: string }[];
  description?: string;
  onChange: (value: string) => void;
  label_props?: Partial<FormLabelProps>;
  onEnter?: () => void; // called when enter is pressed
  onEscape?: () => void; // called when escape is pressed
  other_dialog?: (value: string, onSelect: (value: string) => void) => void;
}

interface FormLabelProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  direction?: "column" | "row";
}

export const FormLabel = ({
  label,
  children,
  className,
  direction = "column",
}: FormLabelProps) => {
  return (
    <div
      className={`flex gap-2 ${
        direction === "row" ? "flex-row" : "flex-col"
      } ${className}`}
    >
      <label className="text-sm font-bold">{label}</label>
      {direction === "row" && <div className="flex-1" />}
      {children}
    </div>
  );
};

export const FormFieldDefault = ({
  className,
  type,
  label,
  name,
  value,
  onChange,
  label_props,
  onEnter,
  onEscape,
  placeholder,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <input
        className="border border-primary rounded-md p-2"
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter?.();
          }
          if (e.key === "Escape") {
            onEscape?.();
          }
        }}
        placeholder={placeholder}
      />
    </FormLabel>
  );
};

export const FormFieldSelect = ({
  type,
  label,
  name,
  value,
  options,
  onChange,
  className,
  label_props,
  other_dialog,
}: FormFieldProps) => {
  const is_selected_in_options = options?.some(
    (option) => option.value === value
  );

  return (
    <FormLabel label={label} className={className} {...label_props}>
      <div className="flex flex-row">
        <select
          className="border border-primary rounded-md p-2 flex-1 gap-2"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
          {!is_selected_in_options && <option value={value}>{value}</option>}
        </select>
        {other_dialog && (
          <button
            className="border border-primary rounded-md p-2 max-w-10 max-h-10 cursor-pointer ml-2"
            onClick={() => other_dialog(value, onChange)}
          >
            <Icon name="ellipsisH" />
          </button>
        )}
      </div>
    </FormLabel>
  );
};

export const FormFieldImage = ({
  type,
  label,
  name,
  value,
  onChange,
  className,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className}>
      <AssetSelectorButton
        placeholder={label}
        name={name}
        value={value}
        className={`m-2 ${className}`}
        onChange={(value) => onChange(value)}
      />
    </FormLabel>
  );
};

export const FormFieldBoolean = ({
  type,
  label,
  name,
  value,
  onChange,
  className,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} direction="row">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={value === "true"}
        onChange={(e) => onChange(e.target.checked ? "true" : "false")}
      />
    </FormLabel>
  );
};

export const FormFieldTextarea = ({
  type,
  label,
  name,
  value,
  onChange,
  className,
  label_props,
  onEnter,
  onEscape,
  description,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <div className="flex flex-row">{description}</div>
      <textarea
        className="border border-primary rounded-md p-2"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        onKeyDown={(e) => {
          // on shift enter, call onEnter
          if (e.shiftKey && e.key === "Enter") {
            onEnter?.();
          }
          if (e.ctrlKey && e.key === "Enter") {
            onEnter?.();
          }
          if (e.key === "Escape") {
            onEscape?.();
          }
        }}
      />
    </FormLabel>
  );
};

export const FormFieldSelectButtons = ({
  type,
  label,
  name,
  value,
  options,
  onChange,
  className,
  label_props,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} direction="row">
      <div className="flex flex-row bg-gray-700 rounded-md shadow-2xs border-primary border-1 shadow-gray-400/25 overflow-hidden">
        {options?.map((option, idx) => (
          <button
            key={option.value}
            value={option.value}
            className={`px-2 cursor-pointer hover:bg-focus hover:text-focus ${
              idx !== 0 ? "border-l border-primary" : ""
            } ${value === option.value ? "bg-focus text-focus" : ""}`}
            onClick={() => onChange(option.value)}
            title={option.label}
          >
            {option.icon ? <Icon name={option.icon} /> : option.label}
          </button>
        ))}
      </div>
    </FormLabel>
  );
};

export const FormFieldDescription = ({
  label,
  className,
  label_props,
  placeholder,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <div className="text-gray-400 text-sm">{placeholder}</div>
    </FormLabel>
  );
};

export const FormFieldColor = ({
  className,
  type,
  label,
  name,
  value,
  onChange,
  label_props,
  placeholder,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <div className="flex flex-row">
        <input
          className="border border-primary rounded-md p-2 flex-1 h-10"
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          className="border border-primary rounded-md p-2 max-w-10 max-h-10 pointer-cursor ml-2"
          onClick={() => onChange("")}
        >
          <Icon name="trash" />
        </button>
      </div>
    </FormLabel>
  );
};

export const FormField = (props: FormFieldProps) => {
  switch (props.type) {
    case "text":
      return <FormFieldDefault {...props} />;
    case "select":
      return <FormFieldSelect {...props} />;
    case "image":
      return <FormFieldImage {...props} />;
    case "textarea":
      return <FormFieldTextarea {...props} />;
    case "color":
      return <FormFieldColor {...props} />;
    case "boolean":
      return <FormFieldBoolean {...props} />;
    case "select-buttons":
      return <FormFieldSelectButtons {...props} />;
    case "description":
      return <FormFieldDescription {...props} />;
    default:
      return <FormFieldDefault {...props} />;
  }
};
