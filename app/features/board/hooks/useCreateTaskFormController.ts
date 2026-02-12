"use client";

import { Task as TaskFormData, taskSchema } from "@/app/libs/validations/task.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useState } from "react";

type UseCreateTaskFormControllerParams = {
  columnId: string;
  addTask: (columnId: string, title: string) => void;
};

export const useCreateTaskFormController = ({
  columnId,
  addTask,
}: UseCreateTaskFormControllerParams) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "" },
  });

  const openForm = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const onSubmit: SubmitHandler<TaskFormData> = useCallback(
    (data) => {
      addTask(columnId, data.title);
      closeForm();
      reset();
    },
    [addTask, closeForm, columnId, reset],
  );

  return {
    control,
    handleSubmit,
    onSubmit,
    isFormOpen,
    openForm,
    closeForm,
  };
};
