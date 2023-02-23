import type { NextPage } from "next";
import { useRouter } from "next/router";
import { TodoSection } from "../../features/todo/section";
import { Loader } from "../../features/ui/loader";

const GoalPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    if (typeof id !== "string") {
        router.replace("/");
        return <Loader />;
    }

    return (
        <main className="grid grow grid-cols-2">
            <TodoSection goalId={id} />
        </main>
    );
};

export default GoalPage;
