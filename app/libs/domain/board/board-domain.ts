import { Column, TaskLocation } from "@/app/libs/types/board-type";

export const DEFAULT_BOARD_TITLE = "Demo Board";
export const MAX_BOARD_TITLE_LENGTH = 80;
export const MAX_ENTITY_TITLE_LENGTH = 50;

export const normalizeBoardTitle = (title: string): string => {
  const normalizedTitle = normalizeEntityTitle(title, MAX_BOARD_TITLE_LENGTH);
  return normalizedTitle || DEFAULT_BOARD_TITLE;
};

export const normalizeEntityTitle = (
  title: string,
  maxLength = MAX_ENTITY_TITLE_LENGTH,
): string => {
  return title.replace(/\s+/g, " ").trim().slice(0, maxLength);
};

export const moveColumnInList = (
  columns: Column[],
  fromIndex: number,
  toIndex: number,
): void => {
  const totalColumns = columns.length;
  if (totalColumns < 2) return;
  if (fromIndex < 0 || fromIndex >= totalColumns) return;

  const boundedToIndex = clamp(toIndex, 0, totalColumns - 1);
  if (fromIndex === boundedToIndex) return;

  const [moved] = columns.splice(fromIndex, 1);
  if (!moved) return;

  columns.splice(boundedToIndex, 0, moved);
};

export const moveTaskInColumns = (
  columns: Column[],
  source: TaskLocation,
  destination: TaskLocation,
): void => {
  const sourceColumn = columns.find((column) => column.id === source.columnId);
  const destinationColumn = columns.find(
    (column) => column.id === destination.columnId,
  );

  if (!sourceColumn || !destinationColumn) return;

  if (
    source.columnId === destination.columnId &&
    source.index === destination.index
  ) {
    return;
  }

  if (source.index < 0 || source.index >= sourceColumn.tasks.length) return;

  const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
  if (!movedTask) return;

  if (source.columnId === destination.columnId) {
    const boundedIndex = clamp(destination.index, 0, sourceColumn.tasks.length);
    sourceColumn.tasks.splice(boundedIndex, 0, movedTask);
    return;
  }

  const boundedIndex = clamp(destination.index, 0, destinationColumn.tasks.length);
  destinationColumn.tasks.splice(boundedIndex, 0, movedTask);
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};
