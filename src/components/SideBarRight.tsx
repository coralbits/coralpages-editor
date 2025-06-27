import { useState } from "react";
import { Page, PageData } from "../types";

interface SideBarRightProps {
  page: Page;
  setSelectedElement: (element: PageData) => void;
}

const SideBarRight = ({ page, setSelectedElement }: SideBarRightProps) => {
  return (
    <div className="flex flex-col bg-purple-200 min-w-[400px]">
      <div className="flex flex-col">{page.title}</div>
      <DocumentLayout
        children={page.data}
        setSelectedElement={setSelectedElement}
      />
    </div>
  );
};

const DocumentLayout = ({
  children,
  setSelectedElement,
}: {
  children: PageData[];
  setSelectedElement: (element: PageData) => void;
}) => {
  return (
    <div className="flex flex-col pl-8">
      {children.map((child, idx) =>
        child.children ? (
          <details key={child.id} open={true} key={child.id || idx}>
            <summary>
              <DocumentItem
                child={child}
                setSelectedElement={setSelectedElement}
              />
            </summary>
            <DocumentLayout
              children={child.children}
              setSelectedElement={setSelectedElement}
            />
          </details>
        ) : (
          <div key={child.id || idx}>
            <DocumentItem
              child={child}
              setSelectedElement={setSelectedElement}
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
}: {
  child: PageData;
  setSelectedElement: (element: PageData) => void;
}) => {
  return (
    <button
      className="w-full text-left cursor-pointer hover:bg-purple-300"
      onClick={() => setSelectedElement(child)}
    >
      {child.type}
    </button>
  );
};

export default SideBarRight;
