import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-sm border-x-4 border-y border-neutral-700 px-2 py-1 font-medium transition hover:bg-neutral-50",
        props.className
      )}
    />
  );
};
