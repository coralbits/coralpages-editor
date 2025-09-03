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
  | "select-buttons";

export interface FormFieldProps {
  className?: string;
  type: FormFieldType;
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  options?: { label: string; value: string; icon?: string }[];
  onChange: (value: string) => void;
  label_props?: Partial<FormLabelProps>;
  onEnter?: () => void; // called when enter is pressed
  onEscape?: () => void; // called when escape is pressed
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
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <select
        className="border border-primary rounded-md p-2"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
    <AssetSelectorButton
      placeholder={label}
      name={name}
      value={value}
      className={`m-2 ${className}`}
      onChange={(value) => onChange(value)}
    />
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
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <textarea
        className="border border-primary rounded-md p-2"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
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
      return <FormFieldDefault {...props} label_props={{ direction: "row" }} />;
    case "boolean":
      return <FormFieldBoolean {...props} />;
    case "select-buttons":
      return <FormFieldSelectButtons {...props} />;
    default:
      return <FormFieldDefault {...props} />;
  }
};
