import { nanoid } from "nanoid";
import { StateCreator } from "zustand";
import {
  moveColumnInList,
  moveTaskInColumns,
  normalizeBoardTitle,
  normalizeEntityTitle,
  DEFAULT_BOARD_TITLE,
} from "../domain/board/board-domain";
import { BoardSlice, Column, Commit, Task } from "../types/board-type";
import { Store } from "../types/store-type";

export const createBoardSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  BoardSlice
> = (set) => ({
  boardTitle: DEFAULT_BOARD_TITLE,
  columns: [],

  setBoardTitle: (title) => {
    set((state) => {
      state.boardTitle = normalizeBoardTitle(title);
    });
  },

  addColumn: (title) => {
    const normalizedTitle = normalizeEntityTitle(title);
    if (!normalizedTitle) return;

    const newColumn: Column = { id: nanoid(), title: normalizedTitle, tasks: [] };
    set((state) => {
      state.columns.push(newColumn);
    });
  },

  removeColumn: (columnId) => {
    set((state) => {
      state.columns = state.columns.filter((c) => c.id !== columnId);
    });
  },

  clearColumnTasks: (columnId) => {
    set((state) => {
      const column = state.columns.find((c) => c.id === columnId);
      if (column) {
        column.tasks = [];
      }
    });
  },

  moveColumn: (fromIndex, toIndex) => {
    set((state) => {
      moveColumnInList(state.columns, fromIndex, toIndex);
    });
  },

  addTask: (columnId, title) => {
    const normalizedTitle = normalizeEntityTitle(title);
    if (!normalizedTitle) return;

    const newTask: Task = { id: nanoid(), title: normalizedTitle, commits: [] };
    set((state) => {
      const column = state.columns.find((c) => c.id === columnId);
      if (column) column.tasks.push(newTask);
    });
  },

  removeTask: (columnId, taskId) => {
    set((state) => {
      const column = state.columns.find((c) => c.id === columnId);
      if (column) column.tasks = column.tasks.filter((t) => t.id !== taskId);
    });
  },

  moveTask: (source, destination) => {
    set((state) => {
      moveTaskInColumns(state.columns, source, destination);
    });
  },

  addComment: (columnId, taskId, content) => {
    const normalizedContent = content.trim();
    if (!normalizedContent) return;

    const newCommit: Commit = {
      id: nanoid(),
      content: normalizedContent,
      createdAt: Date.now(),
    };
    set((state) => {
      const column = state.columns.find((c) => c.id === columnId);
      const task = column?.tasks.find((t) => t.id === taskId);
      if (task) task.commits.push(newCommit);
    });
  },
});
