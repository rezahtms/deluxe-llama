import { Column, TaskLocation } from "@/app/libs/types/board-type";

export interface BoardReadModel {
  boardTitle: string;
  columns: Column[];
}

export interface BoardTitleWriter {
  setBoardTitle: (title: string) => void;
}

export interface ColumnWriter {
  addColumn: (title: string) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;
}

export interface TaskWriter {
  addTask: (columnId: string, title: string) => void;
  addComment: (columnId: string, taskId: string, content: string) => void;
  moveTask: (source: TaskLocation, destination: TaskLocation) => void;
}
