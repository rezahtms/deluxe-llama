"use client";

import { useBoardTitleEditor } from "@/app/features/board/hooks/useBoardTitleEditor";
import {
  useBoardTitle,
  useSetBoardTitle,
} from "@/app/features/board/hooks/useBoardStoreSelectors";
import Container from "../ui/Container";

export default function Header() {
  const boardTitle = useBoardTitle();
  const setBoardTitle = useSetBoardTitle();

  const {
    isEditingTitle,
    draftTitle,
    setDraftTitle,
    startEditingTitle,
    saveTitle,
    handleTitleSubmit,
    handleTitleInputKeyDown,
  } = useBoardTitleEditor({
    boardTitle,
    setBoardTitle,
  });

  return (
    <Container>
      <header className="layout-header-primary">
        {isEditingTitle ? (
          <form
            className="layout-header-primary__title-form"
            onSubmit={handleTitleSubmit}
          >
            <label htmlFor="board-title-input" className="sr-only">
              Board title
            </label>
            <input
              className="layout-header-primary__title-input layout-header-primary__title-input--active"
              id="board-title-input"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onBlur={saveTitle}
              onKeyDown={handleTitleInputKeyDown}
              autoFocus
              maxLength={80}
              aria-describedby="board-title-help"
            />
            <p id="board-title-help" className="sr-only">
              Press Enter to save or Escape to cancel.
            </p>
          </form>
        ) : (
          <h1 className="layout-header-primary__title">
            <button
              type="button"
              className="layout-header-primary__title-trigger"
              onClick={startEditingTitle}
              aria-label="Edit board title"
            >
              {boardTitle}
            </button>
          </h1>
        )}
      </header>
    </Container>
  );
}
