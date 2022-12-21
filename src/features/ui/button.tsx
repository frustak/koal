import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { Loader } from "./loader";

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

type ButtonProps = BaseButtonProps & {
  variant?: "default" | "filled";
};

export const Button = ({
  children,
  loading,
  className,
  variant = "default",
  type = "button",
  ...attrs
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-1 border-neutral-700 font-medium";
  const defaultClasses = clsx(
    "rounded-sm border-x-4 border-y px-2 py-1",
    !loading && "hover:bg-neutral-50"
  );
  const filledClasses = clsx(
    "border bg-neutral-700 px-2 py-0.5 text-white outline outline-1 outline-neutral-700 hover:border-neutral-600 hover:bg-neutral-600 hover:outline-neutral-600"
  );

  return (
    <button
      className={clsx(
        baseClasses,
        variant === "default" && defaultClasses,
        variant === "filled" && filledClasses,
        className
      )}
      disabled={loading}
      type={type}
      {...attrs}
    >
      {children}
      {loading && <Loader size={20} />}
    </button>
  );
};

type IconButtonProps = BaseButtonProps;

export const IconButton = ({
  children,
  loading,
  className,
  type = "button",
  ...attrs
}: IconButtonProps) => {
  return (
    <button
      className={clsx(
        "inline-flex h-6 w-6 items-center justify-center rounded-sm border-2 border-neutral-700 text-neutral-700",
        !loading && "hover:bg-neutral-100",
        className
      )}
      disabled={loading}
      type={type}
      {...attrs}
    >
      {loading ? <Loader size={20} /> : children}
    </button>
  );
};
