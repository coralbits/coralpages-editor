import { Page, PageData } from "../types";
import ElementEditor from "./ElementEditor";

interface SideBarLeftProps {
  page: Page;
  element?: PageData;
}

const SideBarLeft = ({ page, element }: SideBarLeftProps) => {
  return (
    <div className="flex flex-col h-full bg-purple-200 min-w-[400px]">
      <div className="flex flex-row bg-purple-200 h-16">
        <button className="hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2">
          +
        </button>
        <button className="hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2">
          {element ? element.type : "No element selected"}
        </button>
        <button className="hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2">
          -
        </button>
      </div>
      {element ? (
        <ElementEditor element={element} />
      ) : (
        <div>No element selected</div>
      )}
    </div>
  );
};

export default SideBarLeft;
