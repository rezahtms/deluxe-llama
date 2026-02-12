"use client";

import { useBoardDnd } from "@/app/features/board/hooks/useBoardDnd";
import {
  useBoardColumns,
  useMoveColumn,
  useMoveTask,
} from "@/app/features/board/hooks/useBoardStoreSelectors";
import DndBoardView from "./DndBoardView";

export default function DndBoard() {
  const columns = useBoardColumns();
  const moveColumn = useMoveColumn();
  const moveTask = useMoveTask();

  const dnd = useBoardDnd({
    columns,
    moveColumn,
    moveTask,
  });

  return <DndBoardView columns={columns} dnd={dnd} />;
}
