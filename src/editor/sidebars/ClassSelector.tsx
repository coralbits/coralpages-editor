/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useClassesDefinitions } from "app/hooks/classes";
import { Class } from "app/hooks/classes";
import { PageHooks } from "app/hooks/page";
import { Element } from "app/types";
import { i18n } from "app/utils/i18n";
import Icon from "app/components/Icon";
import Tag from "app/components/Tag";
import { SearchSelectButton } from "app/components/SearchSelect";

interface ClassSelectorProps {
  selected_element: Element;
  page_hooks: PageHooks;
}

const ClassSelector = ({
  selected_element,
  page_hooks,
}: ClassSelectorProps) => {
  const classes = useClassesDefinitions();

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
        <SearchSelectButton
          className="p-2 btn-secondary rounded-md border-primary border-1 hover:bg-focus px-2 m-2 text-xs cursor-pointer"
          options={classes.map((c) => ({
            label: c.description,
            value: c.name,
            tags: c.tags,
          }))}
          selected={selected_element.classes || []}
          onChange={(classes) => {
            page_hooks.onChangeElement({ ...selected_element, classes });
          }}
        >
          <Icon name="plus" />
        </SearchSelectButton>
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
      </div>
    </div>
  );
};

export default ClassSelector;
