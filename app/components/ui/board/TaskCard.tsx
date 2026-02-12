"use client";

import { useTaskCommentsController } from "@/app/features/board/hooks/useTaskCommentsController";
import { useAddComment } from "@/app/features/board/hooks/useBoardStoreSelectors";
import { Commit } from "@/app/libs/types/board-type";
import dynamic from "next/dynamic";
import { memo } from "react";

const TaskCommentsModal = dynamic(() => import("./TaskCommentsModal"), {
  ssr: false,
});

type TaskCardProps = {
  id: string;
  columnId: string;
  title: string;
  commits: Commit[];
};

function TaskCardComponent({ id, columnId, title, commits }: TaskCardProps) {
  const addComment = useAddComment();
  const {
    isOpen,
    modalId,
    titleId,
    descriptionId,
    control,
    handleSubmit,
    onSubmit,
    openModal,
    closeModal,
  } = useTaskCommentsController({
    columnId,
    taskId: id,
    addComment,
  });

  return (
    <>
      <article className="task-card">
        <h3 className="task-card__title">
          {title}
        </h3>
        <div className="task-card__footer">
          <button
            type="button"
            className="task-card__comments-button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={openModal}
            aria-haspopup="dialog"
            aria-controls={modalId}
            aria-expanded={isOpen}
          >
            Comments ({commits.length})
          </button>
        </div>
      </article>
      {isOpen && (
        <TaskCommentsModal
          isOpen={isOpen}
          modalId={modalId}
          titleId={titleId}
          descriptionId={descriptionId}
          taskTitle={title}
          commits={commits}
          onClose={closeModal}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}

const TaskCard = memo(TaskCardComponent);

export default TaskCard;
