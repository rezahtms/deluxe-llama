export type Commit = {
  id: string;
  content: string;
  createdAt: number;
};

export type Task = {
  id: string;
  title: string;
  commits: Commit[];
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type TaskLocation = {
  columnId: string;
  index: number;
};

export interface BoardSlice {
  boardTitle: string;
  columns: Column[];

  setBoardTitle: (title: string) => void;
  addColumn: (title: string) => void;
  removeColumn: (columnId: string) => void;
  clearColumnTasks: (columnId: string) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;

  addTask: (columnId: string, title: string) => void;
  removeTask: (columnId: string, taskId: string) => void;
  moveTask: (source: TaskLocation, destination: TaskLocation) => void;

  addComment: (columnId: string, taskId: string, content: string) => void;
}
