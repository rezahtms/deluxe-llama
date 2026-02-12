"use client";

import { useAppStore } from "@/app/libs/stores/store";

export const useBoardTitle = () => useAppStore((state) => state.boardTitle);

export const useBoardColumns = () => useAppStore((state) => state.columns);

export const useSetBoardTitle = () =>
  useAppStore((state) => state.setBoardTitle);

export const useAddColumn = () => useAppStore((state) => state.addColumn);

export const useRemoveColumn = () => useAppStore((state) => state.removeColumn);

export const useClearColumnTasks = () =>
  useAppStore((state) => state.clearColumnTasks);

export const useAddTask = () => useAppStore((state) => state.addTask);

export const useMoveColumn = () => useAppStore((state) => state.moveColumn);

export const useMoveTask = () => useAppStore((state) => state.moveTask);

export const useAddComment = () => useAppStore((state) => state.addComment);
