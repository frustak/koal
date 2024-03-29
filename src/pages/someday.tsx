import type { NextPage } from "next";
import { TodosList } from "../features/todo/list";
import { Title } from "../features/ui/title";
import { trpc } from "../utils/trpc";

const SomedayPage: NextPage = () => {
    const todoQuery = trpc.todo.getTodos.useQuery({ priority: "not_urgent" });
    const notUrgentTasks = todoQuery.data?.todos ?? [];

    return (
        <main className="grid grow grid-cols-2 pt-4">
            <div>
                <Title>Remember...</Title>
                <TodosList
                    todos={notUrgentTasks}
                    loading={todoQuery.isLoading}
                    emptyMessage="You are a true hero. Nothing to do."
                />
            </div>
        </main>
    );
};

export default SomedayPage;
