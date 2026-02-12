import { Column } from "@/app/libs/types/board-type";
import { ActiveColumnDrag, ActiveTaskDrag, TaskDestination } from "../types/dnd.types";

type ViewportScrollDelta = {
  horizontalDelta: number;
  verticalDelta: number;
};

type GetViewportScrollDeltaParams = {
  clientX: number;
  clientY: number;
  viewportWidth: number;
  viewportHeight: number;
  edgeSize: number;
  stepSize: number;
};

type CalculateColumnDropIndexParams = {
  columns: Column[];
  columnRefs: Map<string, HTMLDivElement>;
  clientX: number;
  draggedColumnId: string;
};

type CalculateTaskDestinationParams = {
  columns: Column[];
  columnRefs: Map<string, HTMLDivElement>;
  taskRefs: Map<string, HTMLElement>;
  clientX: number;
  clientY: number;
  dragState: ActiveTaskDrag;
};

const calculateEdgeIntensity = (distance: number, edgeSize: number) => {
  return Math.min(1, distance / edgeSize);
};

export const findClosestColumnId = ({
  columns,
  columnRefs,
  clientX,
}: {
  columns: Column[];
  columnRefs: Map<string, HTMLDivElement>;
  clientX: number;
}): string | null => {
  let closestColumnId: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const column of columns) {
    const element = columnRefs.get(column.id);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(clientX - center);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestColumnId = column.id;
    }
  }

  return closestColumnId;
};

export const calculateColumnDropIndex = ({
  columns,
  columnRefs,
  clientX,
  draggedColumnId,
}: CalculateColumnDropIndexParams): number => {
  const orderedIds = columns
    .map((column) => column.id)
    .filter((columnId) => columnId !== draggedColumnId);

  let nextDropIndex = orderedIds.length;

  for (let index = 0; index < orderedIds.length; index += 1) {
    const element = columnRefs.get(orderedIds[index]);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    if (clientX < rect.left + rect.width / 2) {
      nextDropIndex = index;
      break;
    }
  }

  return nextDropIndex;
};

export const calculateTaskDestination = ({
  columns,
  columnRefs,
  taskRefs,
  clientX,
  clientY,
  dragState,
}: CalculateTaskDestinationParams): TaskDestination => {
  let destinationColumnId: string | null = null;

  for (const column of columns) {
    const element = columnRefs.get(column.id);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right) {
      destinationColumnId = column.id;
      break;
    }
  }

  if (!destinationColumnId) {
    destinationColumnId =
      findClosestColumnId({ columns, columnRefs, clientX }) ??
      dragState.sourceColumnId;
  }

  const destinationColumn = columns.find(
    (column) => column.id === destinationColumnId,
  );

  if (!destinationColumn) {
    return {
      columnId: dragState.sourceColumnId,
      index: dragState.sourceIndex,
    };
  }

  const orderedTaskIds = destinationColumn.tasks
    .map((task) => task.id)
    .filter((taskId) => taskId !== dragState.taskId);

  let destinationIndex = orderedTaskIds.length;

  for (let index = 0; index < orderedTaskIds.length; index += 1) {
    const taskElement = taskRefs.get(orderedTaskIds[index]);
    if (!taskElement) continue;

    const rect = taskElement.getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      destinationIndex = index;
      break;
    }
  }

  return {
    columnId: destinationColumn.id,
    index: destinationIndex,
  };
};

export const getViewportScrollDelta = ({
  clientX,
  clientY,
  viewportWidth,
  viewportHeight,
  edgeSize,
  stepSize,
}: GetViewportScrollDeltaParams): ViewportScrollDelta => {
  let horizontalDelta = 0;
  let verticalDelta = 0;

  if (clientX < edgeSize) {
    const distance = edgeSize - clientX;
    const intensity = calculateEdgeIntensity(distance, edgeSize);
    horizontalDelta = -Math.ceil(stepSize * intensity);
  } else if (clientX > viewportWidth - edgeSize) {
    const distance = clientX - (viewportWidth - edgeSize);
    const intensity = calculateEdgeIntensity(distance, edgeSize);
    horizontalDelta = Math.ceil(stepSize * intensity);
  }

  if (clientY < edgeSize) {
    const distance = edgeSize - clientY;
    const intensity = calculateEdgeIntensity(distance, edgeSize);
    verticalDelta = -Math.ceil(stepSize * intensity);
  } else if (clientY > viewportHeight - edgeSize) {
    const distance = clientY - (viewportHeight - edgeSize);
    const intensity = calculateEdgeIntensity(distance, edgeSize);
    verticalDelta = Math.ceil(stepSize * intensity);
  }

  return { horizontalDelta, verticalDelta };
};

export const getColumnDragOffset = (drag: ActiveColumnDrag) => {
  const x =
    drag.currentX -
    drag.startX +
    (drag.currentScrollX - drag.startScrollX);

  const y =
    drag.currentY -
    drag.startY +
    (drag.currentScrollY - drag.startScrollY);

  return { x, y };
};

export const getTaskDragPosition = (drag: ActiveTaskDrag) => {
  return {
    x: drag.currentX - drag.pointerOffsetX,
    y: drag.currentY - drag.pointerOffsetY,
  };
};
