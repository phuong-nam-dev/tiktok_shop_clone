import { cn } from "@/lib/utils";
import type React from "react";
import { forwardRef } from "react";

type ButtonProps = React.HTMLProps<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ButtonProps>((props, ref) => {
  return (
    <div
      className={cn("size-full mx-auto max-w-7xl px-10 py-6", props?.className)}
      ref={ref}
    >
      {props.children}
    </div>
  );
});

export default Container;
