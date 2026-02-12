"use client";

import { useColumnActionsController } from "@/app/features/board/hooks/useColumnActionsController";
import { useColumnActionsMenu } from "@/app/features/board/hooks/useColumnActionsMenu";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import CloseIcon from "../../icons/CloseIcon";
import EllipsisIcon from "../../icons/EllipsisIcon";

type Props = {
  columnId: string;
};

function ColumnActionsMenuComponent({ columnId }: Props) {
  const { deleteList, deleteAllCards } = useColumnActionsController({
    columnId,
  });

  const {
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
  } = useColumnActionsMenu({
    onDeleteList: deleteList,
    onDeleteAllCards: deleteAllCards,
  });

  return (
    <div className="column-actions" ref={containerRef}>
      <button
        className="column__actions-button"
        onPointerDown={handleTriggerPointerDown}
        onClick={handleTriggerClick}
        aria-label="Open list actions"
        aria-haspopup="dialog"
        aria-controls={menuId}
        aria-expanded={isOpen}
        type="button"
      >
        <EllipsisIcon />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id={menuId}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            className="column-actions__panel"
            onPointerDown={handlePanelPointerDown}
            initial={{ opacity: 0, y: -8, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, height: "auto", scale: 1 }}
            exit={{ opacity: 0, y: -8, height: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="column-actions__header">
              <h3 id={titleId} className="column-actions__title">
                List Actions
              </h3>
              <button
                type="button"
                className="column-actions__close"
                aria-label="Close list actions"
                onPointerDown={handleTriggerPointerDown}
                onClick={handleCloseClick}
              >
                <CloseIcon />
              </button>
            </header>

            <ul className="column-actions__list" aria-label="Column actions">
              <li className="column-actions__item">
                <button
                  type="button"
                  className="column-actions__action column-actions__action--danger"
                  onClick={handleDeleteListClick}
                >
                  Delete List
                </button>
              </li>
              <li className="column-actions__item">
                <button
                  type="button"
                  className="column-actions__action"
                  onClick={handleDeleteAllCardsClick}
                >
                  Delete All Cards
                </button>
              </li>
            </ul>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

const ColumnActionsMenu = memo(ColumnActionsMenuComponent);

export default ColumnActionsMenu;
