import React from "react";
import CreateTaskForm from "./CreateTaskForm";
import ColumnActionsMenu from "./ColumnActionsMenu";

export default function Column({
  children,
  columnId,
  title,
  isDragging = false,
  onDragHandlePointerDown,
}: {
  children: React.ReactNode;
  title: string;
  columnId: string;
  isDragging?: boolean;
  onDragHandlePointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
}) {
  return (
    <div
      data-column-id={columnId}
      className={`column ${isDragging ? "column--dragging" : ""}`}
    >
      <div className="column__body">
        <header
          className={`column__header ${
            onDragHandlePointerDown
              ? "column__header--draggable"
              : ""
          }`}
          style={{
            touchAction: onDragHandlePointerDown ? "pan-y" : "auto",
          }}
          onPointerDown={onDragHandlePointerDown}
        >
          <h2 className="column__title">
            {title}
          </h2>
          <ColumnActionsMenu columnId={columnId} />
        </header>
        {children}
      </div>

      <CreateTaskForm columnId={columnId} />
    </div>
  );
}
