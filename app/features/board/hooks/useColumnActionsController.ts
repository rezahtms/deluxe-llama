"use client";

import { useCallback } from "react";
import {
  useClearColumnTasks,
  useRemoveColumn,
} from "./useBoardStoreSelectors";

type UseColumnActionsControllerParams = {
  columnId: string;
};

export type ColumnActionsController = {
  deleteList: () => void;
  deleteAllCards: () => void;
};

export const useColumnActionsController = ({
  columnId,
}: UseColumnActionsControllerParams): ColumnActionsController => {
  const removeColumn = useRemoveColumn();
  const clearColumnTasks = useClearColumnTasks();

  const deleteList = useCallback(() => {
    removeColumn(columnId);
  }, [columnId, removeColumn]);

  const deleteAllCards = useCallback(() => {
    clearColumnTasks(columnId);
  }, [clearColumnTasks, columnId]);

  return {
    deleteList,
    deleteAllCards,
  };
};
