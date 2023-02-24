import { trpc } from "../../utils/trpc";
import { Subtitle, Title } from "../ui/title";
import { TodoForm } from "./form";
import { TodosList } from "./list";

export const TodoSection = ({ goalId }: { goalId: string | null }) => {
    return (
        <div className="flex flex-col">
            <Title>Todos</Title>
            {!goalId && <Subtitle>Select a goal to see todos</Subtitle>}
            {goalId && <AllTodoList goalId={goalId} />}
            {goalId && (
                <div className="mt-6">
                    <TodoForm goalId={goalId} />
                </div>
            )}
        </div>
    );
};

const AllTodoList = ({ goalId }: { goalId: string }) => {
    const todosQuery = trpc.todo.getTodos.useQuery({
        goalIds: [goalId],
    });
    const todos = todosQuery.data?.todos ?? [];

    return <TodosList todos={todos} loading={todosQuery.isLoading} />;
};
