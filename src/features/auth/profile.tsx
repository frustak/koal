import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

export const Profile = () => {
    const session = useSession();

    return (
        <div className="flex items-center gap-6">
            <div className="text-sm">{session.data?.user?.name}</div>
            <Button className="text-xs" onClick={() => signOut()}>
                Sign Out
            </Button>
        </div>
    );
};
