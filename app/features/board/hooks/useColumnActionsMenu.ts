"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

type UseColumnActionsMenuParams = {
  onDeleteList: () => void;
  onDeleteAllCards: () => void;
};

export type ColumnActionsMenuController = {
  containerRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  menuId: string;
  titleId: string;
  handleTriggerClick: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  handleTriggerPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  handlePanelPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  handleCloseClick: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  handleDeleteListClick: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  handleDeleteAllCardsClick: (event: ReactMouseEvent<HTMLButtonElement>) => void;
};

export const useColumnActionsMenu = ({
  onDeleteList,
  onDeleteAllCards,
}: UseColumnActionsMenuParams): ColumnActionsMenuController => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  const menuId = `column-actions-menu-${id}`;
  const titleId = `column-actions-title-${id}`;

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((previous) => !previous);
  }, []);

  const handleTriggerPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      event.stopPropagation();
    },
    [],
  );

  const handlePanelPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      event.stopPropagation();
    },
    [],
  );

  const handleTriggerClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      toggleMenu();
    },
    [toggleMenu],
  );

  const handleCloseClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      closeMenu();
    },
    [closeMenu],
  );

  const handleDeleteListClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      closeMenu();
      onDeleteList();
    },
    [closeMenu, onDeleteList],
  );

  const handleDeleteAllCardsClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      closeMenu();
      onDeleteAllCards();
    },
    [closeMenu, onDeleteAllCards],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (containerRef.current?.contains(target)) return;

      closeMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeMenu, isOpen]);

  return {
    containerRef,
    isOpen,
    menuId,
    titleId,
    handleTriggerClick,
    handleTriggerPointerDown,
    handlePanelPointerDown,
    handleCloseClick,
    handleDeleteListClick,
    handleDeleteAllCardsClick,
  };
};
