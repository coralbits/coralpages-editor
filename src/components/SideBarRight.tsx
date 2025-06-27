import { useState } from "react";
import { Page, ElementData } from "../types";

interface SideBarRightProps {
  page: Page;
  setSelectedElement: (element: ElementData) => void;
  selectedElement?: ElementData;
}

const SideBarRight = ({
  page,
  setSelectedElement,
  selectedElement,
}: SideBarRightProps) => {
  return (
    <div className="flex flex-col bg-purple-200 min-w-[400px]">
      <div className="flex flex-col">{page.title}</div>
      <DocumentLayout
        children={page.data}
        setSelectedElement={setSelectedElement}
        selectedElement={selectedElement}
      />
    </div>
  );
};

const DocumentLayout = ({
  children,
  setSelectedElement,
  selectedElement,
}: {
  children: ElementData[];
  setSelectedElement: (element: ElementData) => void;
  selectedElement?: ElementData;
}) => {
  return (
    <div className="flex flex-col pl-8">
      {children.map((child, idx) =>
        child.children ? (
          <details open={true} key={child.id || idx}>
            <summary>
              <DocumentItem
                child={child}
                setSelectedElement={setSelectedElement}
                selectedElement={selectedElement}
              />
            </summary>
            <DocumentLayout
              children={child.children}
              setSelectedElement={setSelectedElement}
              selectedElement={selectedElement}
            />
          </details>
        ) : (
          <div key={child.id || idx}>
            <DocumentItem
              child={child}
              setSelectedElement={setSelectedElement}
              selectedElement={selectedElement}
            />
          </div>
        )
      )}
    </div>
  );
};

const DocumentItem = ({
  child,
  setSelectedElement,
  selectedElement,
}: {
  child: ElementData;
  setSelectedElement: (element: ElementData) => void;
  selectedElement?: ElementData;
}) => {
  const is_selected = selectedElement && child.id === selectedElement.id;

  return (
    <button
      className={`w-full text-left cursor-pointer hover:bg-purple-500 active:bg-purple-400 transition-colors ${
        is_selected ? "bg-purple-500" : ""
      }`}
      onClick={() => setSelectedElement(child)}
    >
      {child.type}
    </button>
  );
};

export default SideBarRight;
