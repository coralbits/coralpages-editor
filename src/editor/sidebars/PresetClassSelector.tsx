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
import { Element, Page } from "app/types";
import { i18n } from "app/utils/i18n";
import Icon from "app/components/Icon";
import Tag from "app/components/Tag";
import { SearchSelectButton } from "app/components/SearchSelect";

interface PresetClassSelectorProps {
  selected_element: Element;
  page_hooks: PageHooks;
}

const PresetClassSelector = ({
  selected_element,
  page_hooks,
}: PresetClassSelectorProps) => {
  const classes = useClassesDefinitions();

  const find_class_description = (clss: string) => {
    return classes.find((c: Class) => c.name === clss)?.description;
  };
  const find_class_tags = (clss: string) => {
    return classes.find((c: Class) => c.name === clss)?.tags;
  };

  // Sort classes by usage count first, then alphabetically
  const sorted_classes = page_hooks.page
    ? sortClassesByUsage(classes, page_hooks.page)
    : classes.sort((a, b) => a.description.localeCompare(b.description));

  return (
    <div>
      <div className="flex flex-row gap-2">
        <h3 className="p-2 font-bold flex-1">{i18n("Preset classes")}</h3>
        <SearchSelectButton
          className="p-2 btn-secondary rounded-md border border-slate-300 dark:border-slate-600 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white px-2 m-2 text-xs cursor-pointer transition-colors duration-200"
          options={sorted_classes.map((c) => ({
            label: c.description,
            value: c.name,
            tags: c.tags,
          }))}
          selected={selected_element.classes || []}
          onChange={(classes) => {
            page_hooks.onChangeElementField(
              selected_element.id,
              "classes",
              classes,
              false
            );
          }}
        >
          <Icon name="plus" />
        </SearchSelectButton>
      </div>

      <div className="p-2">
        <div className="border border-slate-300 dark:border-slate-600 rounded-md w-full">
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
                className="btn-secondary hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white px-2 rounded-md m-2 cursor-pointer transition-colors duration-200"
                onClick={() => {
                  const updatedClasses = selected_element.classes?.filter(
                    (c) => c !== clss
                  );
                  page_hooks.onChangeElementField(
                    selected_element.id,
                    "classes",
                    updatedClasses,
                    false
                  );
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

/**
 * Counts the usage of each class in a page's element tree
 */
const countClassUsage = (page: Page, classes: Class[]): Map<string, number> => {
  const usageCount = new Map<string, number>();

  // Initialize all classes with 0 usage
  classes.forEach((cls) => usageCount.set(cls.name, 0));

  // Recursively count class usage in elements
  const countInElement = (element: Element) => {
    if (element.classes) {
      element.classes.forEach((className) => {
        const currentCount = usageCount.get(className) || 0;
        usageCount.set(className, currentCount + 1);
      });
    }

    if (element.children) {
      element.children.forEach(countInElement);
    }
  };

  // Count usage in all page elements
  page.children.forEach(countInElement);

  return usageCount;
};

/**
 * Sorts classes by usage count (descending) then alphabetically by description
 */
const sortClassesByUsage = (classes: Class[], page: Page): Class[] => {
  const usageCount = countClassUsage(page, classes);

  return [...classes].sort((a, b) => {
    const usageA = usageCount.get(a.name) || 0;
    const usageB = usageCount.get(b.name) || 0;

    // First sort by usage count (descending)
    if (usageA !== usageB) {
      return usageB - usageA;
    }

    // Then sort alphabetically by description
    return a.description.localeCompare(b.description);
  });
};

export default PresetClassSelector;
