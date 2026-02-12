"use client";

import { Column as ColumnFormData, columnSchema } from "@/app/libs/validations/column.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useState } from "react";

type UseCreateColumnFormControllerParams = {
  addColumn: (title: string) => void;
};

export const createColumnFormVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
};

export const useCreateColumnFormController = ({
  addColumn,
}: UseCreateColumnFormControllerParams) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: { title: "" },
  });

  const openForm = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const onSubmit: SubmitHandler<ColumnFormData> = useCallback(
    (data) => {
      addColumn(data.title);
      reset();
      closeForm();
    },
    [addColumn, closeForm, reset],
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
