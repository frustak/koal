import { Profile } from "../auth/profile";
import { Anchor } from "./anchor";

export const Header = () => {
  return (
    <header className="mb-6 flex items-start justify-between">
      <Anchor href="/">KOAL</Anchor>
      <div className="flex justify-end">
        <Profile />
      </div>
    </header>
  );
};
