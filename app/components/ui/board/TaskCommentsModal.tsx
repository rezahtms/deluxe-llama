"use client";

import { TaskCommentsModalProps } from "@/app/features/board/types/task-comments.types";
import { formatCommentDate } from "@/app/features/board/utils/comment.utils";
import { CommentFormData } from "@/app/libs/validations/comment.validation";
import { memo } from "react";
import CloseIcon from "../../icons/CloseIcon";
import BaseModal from "../../shared/BaseModal";
import { FormTextareaField } from "../../shared/FormTextareaField";

function TaskCommentsModalComponent({
  isOpen,
  modalId,
  titleId,
  descriptionId,
  taskTitle,
  commits,
  onClose,
  control,
  handleSubmit,
  onSubmit,
}: TaskCommentsModalProps) {
  const hasComments = commits.length > 0;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      dialogId={modalId}
      titleId={titleId}
      descriptionId={descriptionId}
      panelClassName="task-comments-modal__panel"
    >
      <section className="task-comments-modal">
        <header className="task-comments-modal__header">
          <button
            type="button"
            className="task-comments-modal__close"
            onClick={onClose}
            aria-label="Close comments modal"
          >
            <CloseIcon />
          </button>
          <h3 id={titleId} className="task-comments-modal__title">
            Comments for &quot;{taskTitle}&quot;
          </h3>
        </header>

        <div className="task-comments-modal__body" id={descriptionId}>
          <ul className="task-comments-modal__list" aria-label="Task comments">
            {!hasComments ? (
              <li className="task-comments-modal__empty">
                No comments yet. Be the first to comment!
              </li>
            ) : (
              commits.map((commit) => (
                <li key={commit.id} className="task-comments-modal__item">
                  <p className="task-comments-modal__meta">
                    You · {formatCommentDate(commit.createdAt)}
                  </p>
                  <p className="task-comments-modal__text">
                    {commit.content}
                  </p>
                </li>
              ))
            )}
          </ul>

          <form
            className="task-comments-modal__form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormTextareaField<CommentFormData>
              control={control}
              name="content"
              label="Add comment"
              placeholder="Write a comment..."
              autoFocus
            />
            <button type="submit" className="task-comments-modal__submit">
              Add comment
            </button>
          </form>
        </div>
      </section>
    </BaseModal>
  );
}

const TaskCommentsModal = memo(TaskCommentsModalComponent);

export default TaskCommentsModal;
