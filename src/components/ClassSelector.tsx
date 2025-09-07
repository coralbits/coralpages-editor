import { useState } from "react";
import { useClassesDefinitions } from "../hooks/classes";
import { Class } from "../hooks/classes";
import { PageHooks } from "../hooks/page";
import { Element } from "../types";
import { i18n } from "../utils/i18n";
import { FormFieldSelect } from "./FormField";
import Icon from "./Icon";
import Tag from "./Tag";

interface ClassSelectorProps {
  selected_element: Element;
  page_hooks: PageHooks;
}

const ClassSelector = ({
  selected_element,
  page_hooks,
}: ClassSelectorProps) => {
  const classes = useClassesDefinitions();
  const [search, setSearch] = useState("");
  const [show_popover, setShowPopover] = useState(false);
  const [popover_position, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  });

  const filtered_classes = classes.filter(
    (c: Class) =>
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some((tag: string) =>
        tag.toLowerCase().includes(search.toLowerCase())
      )
  );

  const find_class_description = (clss: string) => {
    return classes.find((c: Class) => c.name === clss)?.description;
  };
  const find_class_tags = (clss: string) => {
    return classes.find((c: Class) => c.name === clss)?.tags;
  };

  return (
    <div>
      <div className="flex flex-row gap-2">
        <h3 className="p-2 font-bold flex-1">{i18n("Preset classes")}</h3>
        <button
          className="p-2 btn-secondary rounded-md border-primary border-1 hover:bg-focus px-2 m-2 text-xs cursor-pointer"
          onClick={(el) => {
            setShowPopover(!show_popover);
            document.getElementById("class-selector-search")?.focus();

            setPopoverPosition({
              top: el.clientY + 10,
              left: 10,
            });
          }}
          id="add-class-button"
        >
          <Icon name="plus" />
        </button>
      </div>

      <div className="p-2">
        <div className="border border-primary rounded-md w-full">
          {selected_element.classes?.map((clss: string) => (
            <div className="flex flex-row gap-2 items-center" key={clss}>
              <div className="grow">
                <div>{find_class_description(clss)}</div>
                <div>
                  {find_class_tags(clss)?.map((tag: string) => (
                    <Tag key={tag} tag={tag} className="ml-2" />
                  ))}
                </div>
              </div>
              <button
                className="btn-secondary hover:bg-focus px-2 rounded-md m-2 cursor-pointer"
                onClick={() => {
                  page_hooks.onChangeElement({
                    ...selected_element,
                    classes: selected_element.classes?.filter(
                      (c) => c !== clss
                    ),
                  });
                }}
              >
                <Icon name="trash" />
              </button>
            </div>
          ))}
        </div>

        {show_popover && (
          <>
            <div
              className="absolute bg-black/50 z-10 w-full h-full top-0 left-0"
              onClick={() => {
                setShowPopover(false);
              }}
            ></div>
            <div
              className="border border-primary rounded-md w-full absolute bg-primary margin-top-[30px] max-w-[600px] text-white shadow-md overflow-hidden m-auto z-10 shadow"
              style={{
                top: popover_position.top,
                left: popover_position.left,
              }}
              id="class-selector-popover"
            >
              <input
                type="text"
                id="class-selector-search"
                placeholder={i18n("Search classes")}
                className="border border-primary rounded-md p-2 w-full"
                autoFocus={true}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                // esc closes
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setShowPopover(false);
                  }
                }}
              />
              <div className="flex flex-col overflow-y-auto max-h-[300px] ">
                {filtered_classes.map((clss: Class) => (
                  <button
                    className={`flex justify-between flex-row gap-2 items-center hover:bg-focus rounded-md p-2 w-full cursor-pointer ${
                      selected_element.classes?.includes(clss.name)
                        ? "bg-focus"
                        : ""
                    }`}
                    key={clss.name}
                    onClick={() => {
                      if (selected_element.classes?.includes(clss.name)) {
                        page_hooks.onChangeElement({
                          ...selected_element,
                          classes: selected_element.classes?.filter(
                            (c) => c !== clss.name
                          ),
                        });
                      } else {
                        page_hooks.onChangeElement({
                          ...selected_element,
                          classes: [
                            ...(selected_element.classes || []),
                            clss.name,
                          ],
                        });
                      }
                    }}
                  >
                    <div className="grow text-start">{clss.description}</div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {clss.tags?.map((tag: string) => (
                        <Tag key={tag} tag={tag} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassSelector;
