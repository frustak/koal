import type { NextPage } from "next";
import { useRouter } from "next/router";
import { TodosSection } from "../../features/todo/section";
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
            <TodosSection goalId={id} />
        </main>
    );
};

export default GoalPage;
