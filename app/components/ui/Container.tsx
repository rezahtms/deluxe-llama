import { cn } from "@/app/libs/utils/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = ComponentPropsWithoutRef<"div"> & {
  className?: string;
  children: ReactNode;
};

export default function Container({ children, className, ...props }: Props) {
  return (
    <div className={cn(className, "container")} {...props}>
      {children}
    </div>
  );
}
