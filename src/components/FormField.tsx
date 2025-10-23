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
        className="border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
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
          className="border border-slate-300 dark:border-slate-600 rounded-md p-2 flex-1 gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
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
            className="border border-slate-300 dark:border-slate-600 rounded-md p-2 max-w-10 max-h-10 cursor-pointer ml-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
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
        className="border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
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
      <div className="flex flex-row bg-slate-200 dark:bg-slate-700 rounded-md shadow-sm border border-slate-300 dark:border-slate-600 overflow-hidden">
        {options?.map((option, idx) => (
          <button
            key={option.value}
            value={option.value}
            className={`px-2 cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
              idx !== 0 ? "border-l border-slate-300 dark:border-slate-600" : ""
            } ${
              value === option.value
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
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
      <div className="text-slate-500 dark:text-slate-400 text-sm">
        {placeholder}
      </div>
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
          className="border border-slate-300 dark:border-slate-600 rounded-md p-2 flex-1 h-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          className="border border-slate-300 dark:border-slate-600 rounded-md p-2 max-w-10 max-h-10 cursor-pointer ml-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
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
