/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import React, { useState, useEffect } from "react";
import Icon from "./Icon";

interface DraggableSidebarProps {
  title: string;
  children: React.ReactNode;
  isFloating: boolean;
  onToggleFloating: () => void;
  position: { top: number; left: number };
  onPositionChange: (position: { top: number; left: number }) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  buttons?: {
    label: string;
    icon: string;
    onClick: () => void;
    className?: string;
  }[];
}

const DraggableSidebar: React.FC<DraggableSidebarProps> = ({
  title,
  children,
  isFloating,
  onToggleFloating,
  position,
  onPositionChange,
  className = "",
  headerClassName = "",
  contentClassName = "",
  buttons = [],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && isFloating) {
        onPositionChange({
          top: e.clientY - dragOffset.y,
          left: e.clientX - dragOffset.x,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isFloating, dragOffset, onPositionChange]);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (isFloating) {
      e.preventDefault();
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      className={`${className} ${
        isFloating
          ? "absolute max-h-[50vh] max-w-[400px] shadow-md/30 rounded-md border-gray-500 border"
          : "min-w-[400px] max-w-[400px] h-full"
      }`}
      style={isFloating ? { top: position.top, left: position.left } : {}}
    >
      <div
        className={`flex flex-row p-2 items-center ${
          isFloating ? "cursor-move" : ""
        } ${headerClassName}`}
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="flex-1">{title}</div>
        {buttons.map((button, idx) => (
          <button
            key={idx}
            className={`border border-blue-500 dark:border-blue-400 p-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white hover:cursor-pointer transition-colors duration-200 ${
              button.className || ""
            }`}
            onClick={button.onClick}
          >
            <Icon name={button.icon} />
          </button>
        ))}
        <button
          className=" border border-blue-500 dark:border-blue-400 p-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white hover:cursor-pointer transition-colors duration-200"
          onClick={onToggleFloating}
        >
          {isFloating ? <Icon name="pin_open" /> : <Icon name="pin" />}
        </button>
      </div>
      <div
        className={`overflow-x-hidden max-w-full overflow-y-auto ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableSidebar;
