"use client";

import { UseTaskCommentsControllerParams } from "@/app/features/board/types/task-comments.types";
import {
  CommentFormData,
  commentSchema,
} from "@/app/libs/validations/comment.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useId, useMemo, useState } from "react";

export const useTaskCommentsController = ({
  columnId,
  taskId,
  addComment,
}: UseTaskCommentsControllerParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const modalId = useMemo(() => `task-comments-modal-${id}`, [id]);
  const titleId = useMemo(() => `task-comments-title-${id}`, [id]);
  const descriptionId = useMemo(() => `task-comments-description-${id}`, [id]);

  const { control, handleSubmit, reset, setFocus } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    reset({ content: "" });
  }, [reset]);

  const onSubmit: SubmitHandler<CommentFormData> = useCallback(
    (data) => {
      addComment(columnId, taskId, data.content);
      reset({ content: "" });
      setFocus("content");
    },
    [addComment, columnId, reset, setFocus, taskId],
  );

  return {
    isOpen,
    modalId,
    titleId,
    descriptionId,
    control,
    handleSubmit,
    onSubmit,
    openModal,
    closeModal,
  };
};
