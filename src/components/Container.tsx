import type React from "react";
import { forwardRef } from "react";

type ButtonProps = React.HTMLProps<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ButtonProps>((props, ref) => {
  return (
    <div className="size-full mx-auto max-w-7xl px-10 py-6" ref={ref}>
      {props.children}
    </div>
  );
});

export default Container;
