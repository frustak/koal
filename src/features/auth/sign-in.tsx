import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export const SignIn = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-9xl">KOAL</h1>
      <Button onClick={() => signIn()}>Sign In</Button>
    </div>
  );
};
