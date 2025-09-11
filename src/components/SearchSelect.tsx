/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useEffect, useRef, useState } from "react";
import Tag from "./Tag";

interface SearchSelectProps {
  options: { label: string; value: string; tags?: string[] }[];
  selected: string[];
  highlight_idx?: number;
  setHighlightIdx?: (value: number) => void;
  onChange: (value: string[]) => void;
  placeholder?: string;
  search?: string;
  setSearch?: (value: string) => void;
  onEscape?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SearchSelect = (props: SearchSelectProps) => {
  const search_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search_ref.current) {
      search_ref.current.focus();
    }
  }, [search_ref]);

  const toggle_option = (value: string) => {
    if (props.selected.includes(value)) {
      props.onChange(props.selected.filter((v) => v !== value));
    } else {
      props.onChange([...props.selected, value]);
    }
  };

  return (
    <div className={props.className} style={props.style}>
      <input
        ref={search_ref}
        type="text"
        placeholder={props.placeholder}
        className="border border-primary rounded-md p-2 w-full text-white bg-secondary"
        value={props.search}
        onChange={(e) => {
          props.setSearch?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            props.onEscape?.();
          }
          if (e.key === "ArrowDown") {
            props.setHighlightIdx?.(
              Math.min(props.options.length - 1, (props.highlight_idx || 0) + 1)
            );
            document
              .getElementById(`option-${props.highlight_idx}`)
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
          }
          if (e.key === "ArrowUp") {
            props.setHighlightIdx?.(
              Math.max((props.highlight_idx || 0) - 1, 0)
            );
            document
              .getElementById(`option-${props.highlight_idx}`)
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
          }
          if (e.key === "Enter") {
            if (props.highlight_idx === undefined) {
              return;
            }
            toggle_option(props.options[props.highlight_idx].value);
          }
        }}
      />
      <div className="overflow-y-auto max-h-[250px]">
        {props.options.map((option, idx) => (
          <button
            key={option.value}
            className={`flex justify-between flex-row gap-2 items-center hover:bg-focus rounded-md p-2 w-full cursor-pointer 
            ${props.selected.includes(option.value) ? "bg-focus" : ""} 
            ${props.highlight_idx === idx ? "border-focus border" : ""}
            `}
            onClick={() => {
              toggle_option(option.value);
            }}
            id={`option-${idx}`}
          >
            <div className="grow text-start">{option.label}</div>
            <div className="flex flex-wrap gap-2 justify-end">
              {option.tags?.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export interface SearchSelectButtonProps {
  options: { label: string; value: string; tags?: string[] }[];
  selected: string[];
  onChange: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
}

export const SearchSelectButton = (props: SearchSelectButtonProps) => {
  const [show_popover, setShowPopover] = useState(false);
  const [popover_position, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  });
  const [highlight_idx, setHighlightIdx] = useState(0);
  const [search, setSearch] = useState("");
  const popover_ref = useRef<HTMLButtonElement>(null);

  const filtered_options = props.options.filter(
    (option) =>
      option.label.toLowerCase().includes(search.toLowerCase()) ||
      option.tags?.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      )
  );

  useEffect(() => {
    setPopoverPosition({
      top: (popover_ref.current?.getBoundingClientRect().top || 0) + 30,
      left: 10,
    });
  }, [popover_ref]);

  return (
    <div>
      <button
        className={props.className}
        ref={popover_ref}
        onClick={(e) => {
          setShowPopover(!show_popover);
        }}
      >
        {props.children}
      </button>
      {show_popover && (
        <div className="relative">
          <div
            className="fixed z-5 bg-black/25 w-full h-full top-0 left-0"
            onClick={() => {
              setShowPopover(false);
            }}
          />
          <div
            className="fixed z-10 bg-secondary p-2 shadow rounded-md max-h-[300px] overflow-hidden text-white border border-primary"
            style={{
              top: popover_position.top,
              left: popover_position.left,
            }}
          >
            <SearchSelect
              options={filtered_options}
              selected={props.selected || []}
              onChange={(values) => {
                props.onChange(values);
              }}
              highlight_idx={highlight_idx}
              setHighlightIdx={(idx) => {
                setHighlightIdx(idx);
              }}
              onEscape={() => {
                setShowPopover(false);
              }}
              search={search}
              setSearch={setSearch}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
