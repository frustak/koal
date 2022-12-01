import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  return (
    <button
      className="border-x-4 border-y border-neutral-700 px-2 py-1 font-medium hover:bg-neutral-50"
      {...props}
    />
  );
};
