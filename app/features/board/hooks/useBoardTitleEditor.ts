"use client";

import { FormEvent, KeyboardEvent, useCallback, useState } from "react";
import { BoardTitleWriter } from "../types/board-controller.types";

type UseBoardTitleEditorParams = BoardTitleWriter & {
  boardTitle: string;
};

export const useBoardTitleEditor = ({
  boardTitle,
  setBoardTitle,
}: UseBoardTitleEditorParams) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const startEditingTitle = useCallback(() => {
    setDraftTitle(boardTitle);
    setIsEditingTitle(true);
  }, [boardTitle]);

  const closeEditing = useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  const saveTitle = useCallback(() => {
    setBoardTitle(draftTitle);
    closeEditing();
  }, [closeEditing, draftTitle, setBoardTitle]);

  const cancelEditing = useCallback(() => {
    setDraftTitle(boardTitle);
    closeEditing();
  }, [boardTitle, closeEditing]);

  const handleTitleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      saveTitle();
    },
    [saveTitle],
  );

  const handleTitleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        cancelEditing();
      }
    },
    [cancelEditing],
  );

  return {
    isEditingTitle,
    draftTitle,
    setDraftTitle,
    startEditingTitle,
    saveTitle,
    handleTitleSubmit,
    handleTitleInputKeyDown,
  };
};
