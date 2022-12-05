import clsx from "clsx";
import { DotsThree } from "phosphor-react";

export const Loader = ({
  size = 32,
  noAnimation,
}: {
  size?: number;
  noAnimation?: boolean;
}) => {
  return (
    <div
      className={clsx("flex justify-center", !noAnimation && "animate-pulse")}
    >
      <DotsThree size={size} weight="duotone" />
    </div>
  );
};
