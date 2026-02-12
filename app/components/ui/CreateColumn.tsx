"use client";

import {
  createColumnFormVariants,
  useCreateColumnFormController,
} from "@/app/features/board/hooks/useCreateColumnFormController";
import { useAddColumn } from "@/app/features/board/hooks/useBoardStoreSelectors";
import { AnimatePresence, motion } from "framer-motion";
import { useId } from "react";
import CloseIcon from "../icons/CloseIcon";
import { FormInputField } from "../shared/FormInputField";

export default function CreateColumn() {
  const addColumn = useAddColumn();
  const titleInputId = useId();

  const { control, handleSubmit, onSubmit, isFormOpen, openForm, closeForm } =
    useCreateColumnFormController({
      addColumn,
    });

  return (
    <div className="board__create_column">
      {!isFormOpen && (
        <button
          type="button"
          className="board__add-btn"
          onClick={openForm}
          aria-expanded={isFormOpen}
          aria-controls="create-column-form"
        >
          + Add another list
        </button>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            id="create-column-form"
            key="create-column-form"
            onSubmit={handleSubmit(onSubmit)}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={createColumnFormVariants}
            className="form-input board__create-form"
            aria-labelledby="create-column-label"
          >
            <label
              htmlFor={titleInputId}
              className="sr-only"
              id="create-column-label"
            >
              Column Title
            </label>

            <FormInputField
              control={control}
              name="title"
              placeholder="Enter a list title"
              id={titleInputId}
              autoFocus
            />

            <div className="form-input__actions">
              <button type="submit" className="form-input__submit">
                Add list
              </button>
              <button
                type="button"
                className="form-input__close"
                onClick={closeForm}
                aria-label="Close form"
              >
                <CloseIcon />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
