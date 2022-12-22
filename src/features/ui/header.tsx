import { Profile } from "../auth/profile";
import { Anchor } from "./anchor";

export const Header = () => {
  return (
    <header className="mb-6 flex items-start justify-between border-b-4 border-neutral-700 px-6 pb-4">
      <Anchor href="/">KOAL</Anchor>
      <div className="flex justify-end">
        <Profile />
      </div>
    </header>
  );
};
