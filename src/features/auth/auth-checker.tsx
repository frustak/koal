import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { Loader } from "../ui/loader";
import { SignIn } from "./sign-in";

export const AuthChecker = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  if (session.status === "loading") return <Loader />;
  if (session.status === "unauthenticated") return <SignIn />;
  return <>{children}</>;
};
