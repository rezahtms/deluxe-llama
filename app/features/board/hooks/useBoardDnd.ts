"use client";

import { Column, TaskLocation } from "@/app/libs/types/board-type";
import {
  AUTO_SCROLL_LIST_EDGE_PX,
  AUTO_SCROLL_LIST_STEP_PX,
  AUTO_SCROLL_VIEWPORT_EDGE_PX,
  AUTO_SCROLL_VIEWPORT_STEP_PX,
  TOUCH_DRAG_ACTIVATE_PX,
  TOUCH_HOLD_DELAY_MS,
  TOUCH_MOVE_CANCEL_PX,
  TOUCH_SCROLL_CANCEL_PX,
} from "../constants/dnd.constants";
import {
  calculateColumnDropIndex,
  calculateTaskDestination,
  getViewportScrollDelta,
} from "../utils/dnd.utils";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ActiveColumnDrag, ActiveTaskDrag } from "../types/dnd.types";

const INTERACTIVE_SELECTOR =
  "button, a, input, textarea, select, label, [role='button'], [data-no-dnd='true']";

type UseBoardDndParams = {
  columns: Column[];
  moveColumn: (fromIndex: number, toIndex: number) => void;
  moveTask: (source: TaskLocation, destination: TaskLocation) => void;
};

export type BoardDndController = {
  activeColumnDrag: ActiveColumnDrag | null;
  activeTaskDrag: ActiveTaskDrag | null;
  registerColumnRef: (columnId: string, node: HTMLDivElement | null) => void;
  registerTaskRef: (taskId: string, node: HTMLElement | null) => void;
  registerTaskListRef: (columnId: string, node: HTMLUListElement | null) => void;
  handleColumnPointerDown: (
    event: ReactPointerEvent<HTMLElement>,
    columnId: string,
  ) => void;
  handleTaskPointerDown: (
    event: ReactPointerEvent<HTMLElement>,
    columnId: string,
    taskId: string,
    sourceIndex: number,
  ) => void;
};

export const useBoardDnd = ({
  columns,
  moveColumn,
  moveTask,
}: UseBoardDndParams): BoardDndController => {
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const taskRefs = useRef<Map<string, HTMLElement>>(new Map());
  const taskListRefs = useRef<Map<string, HTMLUListElement>>(new Map());
  const columnsRef = useRef(columns);

  const [activeColumnDrag, setActiveColumnDrag] =
    useState<ActiveColumnDrag | null>(null);
  const activeColumnDragRef = useRef<ActiveColumnDrag | null>(null);

  const [activeTaskDrag, setActiveTaskDrag] = useState<ActiveTaskDrag | null>(
    null,
  );
  const activeTaskDragRef = useRef<ActiveTaskDrag | null>(null);

  const columnHoldTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const taskHoldTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeColumnPointerTargetRef = useRef<HTMLElement | null>(null);
  const activeTaskPointerTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  const clearColumnHoldTimeout = useCallback(() => {
    if (!columnHoldTimeoutRef.current) return;

    clearTimeout(columnHoldTimeoutRef.current);
    columnHoldTimeoutRef.current = null;
  }, []);

  const clearTaskHoldTimeout = useCallback(() => {
    if (!taskHoldTimeoutRef.current) return;

    clearTimeout(taskHoldTimeoutRef.current);
    taskHoldTimeoutRef.current = null;
  }, []);

  const lockBodySelection = useCallback(() => {
    document.body.style.userSelect = "none";
  }, []);

  const releaseBodySelection = useCallback(() => {
    if (activeColumnDragRef.current || activeTaskDragRef.current) return;

    document.body.style.userSelect = "";
  }, []);

  const capturePointer = useCallback((target: HTMLElement, pointerId: number) => {
    try {
      if (!target.hasPointerCapture(pointerId)) {
        target.setPointerCapture(pointerId);
      }
    } catch {
      return;
    }
  }, []);

  const releasePointer = useCallback((target: HTMLElement | null, pointerId: number) => {
    if (!target) return;

    try {
      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId);
      }
    } catch {
      return;
    }
  }, []);

  const registerColumnRef = useCallback(
    (columnId: string, node: HTMLDivElement | null) => {
      if (node) {
        columnRefs.current.set(columnId, node);
        return;
      }

      columnRefs.current.delete(columnId);
    },
    [],
  );

  const registerTaskRef = useCallback((taskId: string, node: HTMLElement | null) => {
    if (node) {
      taskRefs.current.set(taskId, node);
      return;
    }

    taskRefs.current.delete(taskId);
  }, []);

  const registerTaskListRef = useCallback(
    (columnId: string, node: HTMLUListElement | null) => {
      if (node) {
        taskListRefs.current.set(columnId, node);
        return;
      }

      taskListRefs.current.delete(columnId);
    },
    [],
  );

  const getHorizontalScrollOffset = useCallback(() => {
    return window.scrollX;
  }, []);

  const autoScrollViewport = useCallback((clientX: number, clientY: number) => {
    const { horizontalDelta, verticalDelta } = getViewportScrollDelta({
      clientX,
      clientY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      edgeSize: AUTO_SCROLL_VIEWPORT_EDGE_PX,
      stepSize: AUTO_SCROLL_VIEWPORT_STEP_PX,
    });

    if (horizontalDelta === 0 && verticalDelta === 0) return;

    window.scrollBy(horizontalDelta, verticalDelta);
  }, []);

  const autoScrollTaskList = useCallback((clientY: number, columnId: string) => {
    const listElement = taskListRefs.current.get(columnId);
    if (!listElement) return;

    const rect = listElement.getBoundingClientRect();
    if (rect.height === 0) return;

    if (clientY < rect.top + AUTO_SCROLL_LIST_EDGE_PX) {
      const distance = rect.top + AUTO_SCROLL_LIST_EDGE_PX - clientY;
      const intensity = Math.min(1, distance / AUTO_SCROLL_LIST_EDGE_PX);
      listElement.scrollTop -= Math.ceil(AUTO_SCROLL_LIST_STEP_PX * intensity);
      return;
    }

    if (clientY > rect.bottom - AUTO_SCROLL_LIST_EDGE_PX) {
      const distance = clientY - (rect.bottom - AUTO_SCROLL_LIST_EDGE_PX);
      const intensity = Math.min(1, distance / AUTO_SCROLL_LIST_EDGE_PX);
      listElement.scrollTop += Math.ceil(AUTO_SCROLL_LIST_STEP_PX * intensity);
    }
  }, []);

  const setColumnDragState = useCallback((nextDrag: ActiveColumnDrag | null) => {
    activeColumnDragRef.current = nextDrag;
    setActiveColumnDrag(nextDrag);
  }, []);

  const setTaskDragState = useCallback((nextDrag: ActiveTaskDrag | null) => {
    activeTaskDragRef.current = nextDrag;
    setActiveTaskDrag(nextDrag);
  }, []);

  const activateColumnDrag = useCallback(
    (pointerId: number, clientX?: number, clientY?: number) => {
      const current = activeColumnDragRef.current;
      if (!current || current.pointerId !== pointerId || current.isActive) {
        return;
      }

      const nextDrag: ActiveColumnDrag = {
        ...current,
        currentX: typeof clientX === "number" ? clientX : current.currentX,
        currentY: typeof clientY === "number" ? clientY : current.currentY,
        currentScrollX: getHorizontalScrollOffset(),
        currentScrollY: window.scrollY,
        isActive: true,
      };

      setColumnDragState(nextDrag);
      lockBodySelection();
    },
    [getHorizontalScrollOffset, lockBodySelection, setColumnDragState],
  );

  const activateTaskDrag = useCallback(
    (pointerId: number, clientX?: number, clientY?: number) => {
      const current = activeTaskDragRef.current;
      if (!current || current.pointerId !== pointerId || current.isActive) {
        return;
      }

      const nextDrag: ActiveTaskDrag = {
        ...current,
        currentX: typeof clientX === "number" ? clientX : current.currentX,
        currentY: typeof clientY === "number" ? clientY : current.currentY,
        currentScrollX: getHorizontalScrollOffset(),
        currentScrollY: window.scrollY,
        isActive: true,
      };

      setTaskDragState(nextDrag);
      lockBodySelection();
    },
    [getHorizontalScrollOffset, lockBodySelection, setTaskDragState],
  );

  const finishColumnDrag = useCallback(
    (pointerId?: number) => {
      const current = activeColumnDragRef.current;
      if (!current) return;

      if (typeof pointerId === "number" && current.pointerId !== pointerId) {
        return;
      }

      if (current.isActive) {
        const currentColumns = columnsRef.current;
        const fromIndex = currentColumns.findIndex(
          (column) => column.id === current.columnId,
        );

        const maxIndex = Math.max(0, currentColumns.length - 1);
        const toIndex = Math.min(maxIndex, Math.max(0, current.dropIndex));

        if (fromIndex >= 0 && fromIndex !== toIndex) {
          moveColumn(fromIndex, toIndex);
        }
      }

      const resolvedPointerId =
        typeof pointerId === "number" ? pointerId : current.pointerId;
      releasePointer(activeColumnPointerTargetRef.current, resolvedPointerId);
      activeColumnPointerTargetRef.current = null;
      clearColumnHoldTimeout();
      setColumnDragState(null);
      releaseBodySelection();
    },
    [
      clearColumnHoldTimeout,
      moveColumn,
      releaseBodySelection,
      releasePointer,
      setColumnDragState,
    ],
  );

  const finishTaskDrag = useCallback(
    (pointerId?: number) => {
      const current = activeTaskDragRef.current;
      if (!current) return;

      if (typeof pointerId === "number" && current.pointerId !== pointerId) {
        return;
      }

      if (current.isActive) {
        moveTask(
          { columnId: current.sourceColumnId, index: current.sourceIndex },
          {
            columnId: current.destinationColumnId,
            index: current.destinationIndex,
          },
        );
      }

      const resolvedPointerId =
        typeof pointerId === "number" ? pointerId : current.pointerId;
      releasePointer(activeTaskPointerTargetRef.current, resolvedPointerId);
      activeTaskPointerTargetRef.current = null;
      clearTaskHoldTimeout();
      setTaskDragState(null);
      releaseBodySelection();
    },
    [
      clearTaskHoldTimeout,
      moveTask,
      releaseBodySelection,
      releasePointer,
      setTaskDragState,
    ],
  );

  const handleColumnPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, columnId: string) => {
      if (activeTaskDragRef.current || activeColumnDragRef.current) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const target =
        event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;

      clearColumnHoldTimeout();

      const pointerId = event.pointerId;
      activeColumnPointerTargetRef.current = event.currentTarget;
      capturePointer(event.currentTarget, pointerId);
      const shouldActivateImmediately = event.pointerType === "mouse";
      const dropIndex = columnsRef.current.findIndex(
        (column) => column.id === columnId,
      );

      if (dropIndex < 0) return;

      const currentScrollX = getHorizontalScrollOffset();
      const currentScrollY = window.scrollY;

      const nextDrag: ActiveColumnDrag = {
        columnId,
        pointerId,
        startX: event.clientX,
        startY: event.clientY,
        currentX: event.clientX,
        currentY: event.clientY,
        startScrollX: currentScrollX,
        currentScrollX,
        startScrollY: currentScrollY,
        currentScrollY,
        isActive: shouldActivateImmediately,
        dropIndex,
      };

      setColumnDragState(nextDrag);

      if (shouldActivateImmediately) {
        lockBodySelection();
        event.preventDefault();
        return;
      }

      columnHoldTimeoutRef.current = setTimeout(() => {
        activateColumnDrag(pointerId);
      }, TOUCH_HOLD_DELAY_MS);
    },
    [
      activateColumnDrag,
      capturePointer,
      clearColumnHoldTimeout,
      getHorizontalScrollOffset,
      lockBodySelection,
      setColumnDragState,
    ],
  );

  const handleTaskPointerDown = useCallback(
    (
      event: ReactPointerEvent<HTMLElement>,
      columnId: string,
      taskId: string,
      sourceIndex: number,
    ) => {
      if (activeColumnDragRef.current || activeTaskDragRef.current) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const target =
        event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;

      clearTaskHoldTimeout();

      const pointerId = event.pointerId;
      activeTaskPointerTargetRef.current = event.currentTarget;
      capturePointer(event.currentTarget, pointerId);
      const shouldActivateImmediately = event.pointerType === "mouse";
      const currentScrollX = getHorizontalScrollOffset();
      const currentScrollY = window.scrollY;
      const rect = event.currentTarget.getBoundingClientRect();

      const nextDrag: ActiveTaskDrag = {
        taskId,
        sourceColumnId: columnId,
        sourceIndex,
        pointerId,
        startX: event.clientX,
        startY: event.clientY,
        currentX: event.clientX,
        currentY: event.clientY,
        startScrollX: currentScrollX,
        currentScrollX,
        startScrollY: currentScrollY,
        currentScrollY,
        isActive: shouldActivateImmediately,
        destinationColumnId: columnId,
        destinationIndex: sourceIndex,
        pointerOffsetX: event.clientX - rect.left,
        pointerOffsetY: event.clientY - rect.top,
        cardWidth: rect.width,
      };

      setTaskDragState(nextDrag);

      if (shouldActivateImmediately) {
        lockBodySelection();
        event.preventDefault();
        return;
      }

      taskHoldTimeoutRef.current = setTimeout(() => {
        activateTaskDrag(pointerId);
      }, TOUCH_HOLD_DELAY_MS);
    },
    [
      activateTaskDrag,
      capturePointer,
      clearTaskHoldTimeout,
      getHorizontalScrollOffset,
      lockBodySelection,
      setTaskDragState,
    ],
  );

  useEffect(() => {
    if (!activeColumnDrag && !activeTaskDrag) return;

    const handlePointerMove = (event: PointerEvent) => {
      const columnDrag = activeColumnDragRef.current;

      if (columnDrag && columnDrag.pointerId === event.pointerId) {
        if (!columnDrag.isActive) {
          const movedX = Math.abs(event.clientX - columnDrag.startX);
          const movedY = Math.abs(event.clientY - columnDrag.startY);

          if (movedY > TOUCH_MOVE_CANCEL_PX && movedY > movedX) {
            finishColumnDrag(event.pointerId);
            return;
          }

          if (movedX > TOUCH_MOVE_CANCEL_PX && movedX >= movedY) {
            clearColumnHoldTimeout();
            activateColumnDrag(event.pointerId, event.clientX, event.clientY);
          }

          const activated = activeColumnDragRef.current;
          if (!activated?.isActive) return;
        }

        event.preventDefault();
        autoScrollViewport(event.clientX, event.clientY);

        const latestDrag = activeColumnDragRef.current;
        if (!latestDrag?.isActive) return;

        const dropIndex = calculateColumnDropIndex({
          columns: columnsRef.current,
          columnRefs: columnRefs.current,
          clientX: event.clientX,
          draggedColumnId: latestDrag.columnId,
        });

        const currentScrollX = getHorizontalScrollOffset();
        const currentScrollY = window.scrollY;

        if (
          dropIndex === latestDrag.dropIndex &&
          event.clientX === latestDrag.currentX &&
          event.clientY === latestDrag.currentY &&
          currentScrollX === latestDrag.currentScrollX &&
          currentScrollY === latestDrag.currentScrollY
        ) {
          return;
        }

        const nextDrag: ActiveColumnDrag = {
          ...latestDrag,
          currentX: event.clientX,
          currentY: event.clientY,
          currentScrollX,
          currentScrollY,
          dropIndex,
        };

        setColumnDragState(nextDrag);
        return;
      }

      const taskDrag = activeTaskDragRef.current;
      if (!taskDrag || taskDrag.pointerId !== event.pointerId) return;

      if (!taskDrag.isActive) {
        const movedX = Math.abs(event.clientX - taskDrag.startX);
        const movedY = Math.abs(event.clientY - taskDrag.startY);

        if (movedY > TOUCH_SCROLL_CANCEL_PX && movedY > movedX) {
          finishTaskDrag(event.pointerId);
          return;
        }

        if (movedX > TOUCH_DRAG_ACTIVATE_PX || movedY > TOUCH_DRAG_ACTIVATE_PX) {
          clearTaskHoldTimeout();
          activateTaskDrag(event.pointerId, event.clientX, event.clientY);
        }

        const activated = activeTaskDragRef.current;
        if (!activated?.isActive) {
          return;
        }
      }

      event.preventDefault();
      autoScrollViewport(event.clientX, event.clientY);

      const latestDrag = activeTaskDragRef.current;
      if (!latestDrag?.isActive) return;

      const destination = calculateTaskDestination({
        columns: columnsRef.current,
        columnRefs: columnRefs.current,
        taskRefs: taskRefs.current,
        clientX: event.clientX,
        clientY: event.clientY,
        dragState: latestDrag,
      });

      autoScrollTaskList(event.clientY, destination.columnId);

      const currentScrollX = getHorizontalScrollOffset();
      const currentScrollY = window.scrollY;

      if (
        destination.columnId === latestDrag.destinationColumnId &&
        destination.index === latestDrag.destinationIndex &&
        event.clientX === latestDrag.currentX &&
        event.clientY === latestDrag.currentY &&
        currentScrollX === latestDrag.currentScrollX &&
        currentScrollY === latestDrag.currentScrollY
      ) {
        return;
      }

      const nextDrag: ActiveTaskDrag = {
        ...latestDrag,
        currentX: event.clientX,
        currentY: event.clientY,
        currentScrollX,
        currentScrollY,
        destinationColumnId: destination.columnId,
        destinationIndex: destination.index,
      };

      setTaskDragState(nextDrag);
    };

    const handlePointerUp = (event: PointerEvent) => {
      const columnDrag = activeColumnDragRef.current;
      if (columnDrag?.pointerId === event.pointerId) {
        finishColumnDrag(event.pointerId);
        return;
      }

      const taskDrag = activeTaskDragRef.current;
      if (taskDrag?.pointerId === event.pointerId) {
        finishTaskDrag(event.pointerId);
      }
    };

    const handlePointerCancel = (event: PointerEvent) => {
      const columnDrag = activeColumnDragRef.current;
      if (columnDrag?.pointerId === event.pointerId) {
        finishColumnDrag(event.pointerId);
        return;
      }

      const taskDrag = activeTaskDragRef.current;
      if (taskDrag?.pointerId === event.pointerId) {
        finishTaskDrag(event.pointerId);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [
    activeColumnDrag,
    activeTaskDrag,
    activateColumnDrag,
    activateTaskDrag,
    autoScrollTaskList,
    autoScrollViewport,
    clearColumnHoldTimeout,
    clearTaskHoldTimeout,
    finishColumnDrag,
    finishTaskDrag,
    getHorizontalScrollOffset,
    setColumnDragState,
    setTaskDragState,
  ]);

  useEffect(() => {
    return () => {
      clearColumnHoldTimeout();
      clearTaskHoldTimeout();
      const activeColumnPointerTarget = activeColumnPointerTargetRef.current;
      const activeTaskPointerTarget = activeTaskPointerTargetRef.current;
      const activeColumnDragState = activeColumnDragRef.current;
      const activeTaskDragState = activeTaskDragRef.current;

      if (activeColumnDragState) {
        releasePointer(activeColumnPointerTarget, activeColumnDragState.pointerId);
      }
      if (activeTaskDragState) {
        releasePointer(activeTaskPointerTarget, activeTaskDragState.pointerId);
      }

      activeColumnPointerTargetRef.current = null;
      activeTaskPointerTargetRef.current = null;
      document.body.style.userSelect = "";
    };
  }, [clearColumnHoldTimeout, clearTaskHoldTimeout, releasePointer]);

  return {
    activeColumnDrag,
    activeTaskDrag,
    registerColumnRef,
    registerTaskRef,
    registerTaskListRef,
    handleColumnPointerDown,
    handleTaskPointerDown,
  };
};
