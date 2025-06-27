import { ElementDefinition } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon } from "../hooks/faicon_setup";

interface ElementSelectorProps {
  elementDefinitions?: ElementDefinition[];
  onSelect?: (element: ElementDefinition) => void;
}

const ElementSelector = (props: ElementSelectorProps) => {
  return (
    <div className="flex flex-row gap-2 p-2 flex-wrap w-full justify-around">
      {props.elementDefinitions?.map((element) => (
        <div
          key={element.name}
          className="flex flex-col gap-2 items-center justify-center h-24 w-24 border-2 border-purple-300 rounded-md cursor-pointer hover:bg-purple-500 active:bg-purple-600 transition-colors"
          onClick={() => props.onSelect?.(element)}
        >
          <FontAwesomeIcon icon={getIcon(element.icon)} className="text-2xl" />
          <span className="text-sm text-nowrap">
            {getBasicName(element.name)}
          </span>
        </div>
      ))}
    </div>
  );
};

const getBasicName = (name: string) => {
  if (name.includes("://")) {
    return name.split("://")[1];
  }
  return name;
};

export default ElementSelector;
