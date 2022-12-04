import Link from "next/link";
import { Profile } from "../auth/profile";

export const Header = () => {
  return (
    <header className="mb-10 flex items-start justify-between">
      <Link
        href="/"
        className="rounded-sm bg-neutral-700 p-1 text-xs font-medium text-white transition hover:-rotate-6"
      >
        KOAL
      </Link>
      <div className="flex justify-end">
        <Profile />
      </div>
    </header>
  );
};
