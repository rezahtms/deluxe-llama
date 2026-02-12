"use client";

import { BoardDndController } from "@/app/features/board/hooks/useBoardDnd";
import {
  DRAG_TRANSITION,
  LAYOUT_TRANSITION,
} from "@/app/features/board/constants/dnd.constants";
import {
  getColumnDragOffset,
  getTaskDragPosition,
} from "@/app/features/board/utils/dnd.utils";
import { Column as BoardColumn } from "@/app/libs/types/board-type";
import { LayoutGroup, motion } from "framer-motion";
import CreateColumn from "../CreateColumn";
import Board from "./Board";
import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskList from "./TaskList";

type DndBoardViewProps = {
  columns: BoardColumn[];
  dnd: BoardDndController;
};

export default function DndBoardView({ columns, dnd }: DndBoardViewProps) {
  const {
    activeColumnDrag,
    activeTaskDrag,
    registerColumnRef,
    registerTaskRef,
    registerTaskListRef,
    handleColumnPointerDown,
    handleTaskPointerDown,
  } = dnd;

  return (
    <section className="dnd-board">
      <LayoutGroup id="board-dnd-layout">
        <Board>
          {columns.map((column) => {
            const isColumnDragging =
              activeColumnDrag?.columnId === column.id &&
              Boolean(activeColumnDrag.isActive);

            const isTaskSourceDragging =
              activeTaskDrag?.isActive &&
              activeTaskDrag.sourceColumnId === column.id;

            const columnOffset =
              isColumnDragging && activeColumnDrag
                ? getColumnDragOffset(activeColumnDrag)
                : { x: 0, y: 0 };

            const isTaskDropTarget =
              activeTaskDrag?.isActive &&
              activeTaskDrag.destinationColumnId === column.id;

            return (
              <motion.div
                key={column.id}
                layout="position"
                initial={false}
                transition={isColumnDragging ? DRAG_TRANSITION : LAYOUT_TRANSITION}
                ref={(node) => registerColumnRef(column.id, node)}
                className="dnd-board__column-shell"
                style={
                  isColumnDragging || isTaskSourceDragging
                    ? {
                        zIndex: isColumnDragging ? 12000 : 11000,
                      }
                    : undefined
                }
                animate={
                  isColumnDragging
                    ? {
                        x: columnOffset.x,
                        y: columnOffset.y,
                        scale: 1.015,
                        rotate: 0.2,
                        boxShadow: "0 18px 38px rgba(9,30,66,0.22)",
                      }
                    : {
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                        boxShadow: "0 0px 0px rgba(9,30,66,0)",
                      }
                }
              >
                <Column
                  columnId={column.id}
                  title={column.title}
                  isDragging={isColumnDragging}
                  onDragHandlePointerDown={(event) =>
                    handleColumnPointerDown(event, column.id)
                  }
                >
                  <TaskList
                    listRef={(node) => registerTaskListRef(column.id, node)}
                    isDropTarget={Boolean(isTaskDropTarget)}
                  >
                    {column.tasks.map((task, taskIndex) => {
                      const isTaskDragging =
                        activeTaskDrag?.taskId === task.id &&
                        Boolean(activeTaskDrag.isActive);

                      const taskPosition =
                        isTaskDragging && activeTaskDrag
                          ? getTaskDragPosition(activeTaskDrag)
                          : { x: 0, y: 0 };

                      return (
                        <motion.li
                          key={task.id}
                          layout={isTaskDragging ? false : "position"}
                          initial={false}
                          transition={
                            isTaskDragging ? DRAG_TRANSITION : LAYOUT_TRANSITION
                          }
                          ref={(node) => registerTaskRef(task.id, node)}
                          className="dnd-board__task-shell dnd-board__task-shell--draggable"
                          style={
                            isTaskDragging && activeTaskDrag
                              ? {
                                  position: "fixed",
                                  left: 0,
                                  top: 0,
                                  width: activeTaskDrag.cardWidth,
                                  zIndex: 13000,
                                  pointerEvents: "none",
                                }
                              : undefined
                          }
                          animate={
                            isTaskDragging
                              ? {
                                  x: taskPosition.x,
                                  y: taskPosition.y,
                                  scale: 1.03,
                                  rotate: 0.55,
                                  boxShadow: "0 18px 40px rgba(9,30,66,0.30)",
                                }
                              : {
                                  x: 0,
                                  y: 0,
                                  scale: 1,
                                  rotate: 0,
                                  boxShadow: "0 0px 0px rgba(9,30,66,0)",
                                }
                          }
                          onPointerDown={(event) =>
                            handleTaskPointerDown(event, column.id, task.id, taskIndex)
                          }
                        >
                          <TaskCard {...task} columnId={column.id} />
                        </motion.li>
                      );
                    })}
                  </TaskList>
                </Column>
              </motion.div>
            );
          })}
        </Board>
      </LayoutGroup>
      <CreateColumn />
    </section>
  );
}
