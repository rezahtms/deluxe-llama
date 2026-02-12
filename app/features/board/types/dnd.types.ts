export type ActiveColumnDrag = {
  columnId: string;
  pointerId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startScrollX: number;
  currentScrollX: number;
  startScrollY: number;
  currentScrollY: number;
  isActive: boolean;
  dropIndex: number;
};

export type ActiveTaskDrag = {
  taskId: string;
  sourceColumnId: string;
  sourceIndex: number;
  pointerId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startScrollX: number;
  currentScrollX: number;
  startScrollY: number;
  currentScrollY: number;
  isActive: boolean;
  destinationColumnId: string;
  destinationIndex: number;
  pointerOffsetX: number;
  pointerOffsetY: number;
  cardWidth: number;
};

export type TaskDestination = {
  columnId: string;
  index: number;
};
