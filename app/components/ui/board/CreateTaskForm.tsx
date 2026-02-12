"use client";

import { useAddTask } from "@/app/features/board/hooks/useBoardStoreSelectors";
import { useCreateTaskFormController } from "@/app/features/board/hooks/useCreateTaskFormController";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import CloseIcon from "../../icons/CloseIcon";
import { FormTextareaField } from "../../shared/FormTextareaField";

type Props = {
  columnId: string;
};

export default function CreateTaskForm({ columnId }: Props) {
  const addTask = useAddTask();
  const formId = useMemo(() => `create-task-form-${columnId}`, [columnId]);

  const { control, handleSubmit, onSubmit, isFormOpen, openForm, closeForm } =
    useCreateTaskFormController({
      columnId,
      addTask,
    });

  return (
    <footer className="create-task-form">
      <AnimatePresence>
        {isFormOpen ? (
          <motion.form
            key="form"
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="create-task-form__form"
          >
            <FormTextareaField
              control={control}
              name="title"
              label="Card title"
              placeholder="Enter a Card title"
            />
            <div className="create-task-form__actions">
              <button type="submit" className="create-task-form__submit">
                Create card
              </button>
              <button
                type="button"
                className="create-task-form__close"
                onClick={closeForm}
                aria-label="Close create card form"
              >
                <CloseIcon />
              </button>
            </div>
          </motion.form>
        ) : (
          <button
            type="button"
            onClick={openForm}
            className="create-task-form__trigger"
            aria-expanded={isFormOpen}
            aria-controls={formId}
          >
            + Add another card
          </button>
        )}
      </AnimatePresence>
    </footer>
  );
}
