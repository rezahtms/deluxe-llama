import { Commit } from "@/app/libs/types/board-type";
import { CommentFormData } from "@/app/libs/validations/comment.validation";
import {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";

export type TaskCommentsModalProps = {
  isOpen: boolean;
  modalId: string;
  titleId: string;
  descriptionId: string;
  taskTitle: string;
  commits: Commit[];
  onClose: () => void;
  control: Control<CommentFormData>;
  handleSubmit: UseFormHandleSubmit<CommentFormData>;
  onSubmit: SubmitHandler<CommentFormData>;
};

export type UseTaskCommentsControllerParams = {
  columnId: string;
  taskId: string;
  addComment: (columnId: string, taskId: string, content: string) => void;
};
