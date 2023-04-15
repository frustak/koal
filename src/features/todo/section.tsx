import { trpc } from "../../utils/trpc";
import { Subtitle, Title } from "../ui/title";
import { TodoForm } from "./form";
import type { TodoItemOptions } from "./list";
import { TodosList } from "./list";

export const TodoSection = ({
    goalId,
    options,
}: {
    goalId: string | null;
    options?: TodoItemOptions;
}) => {
    return (
        <div className="flex flex-col">
            <Title>Todos</Title>
            {!goalId && <Subtitle>Select a goal to see todos</Subtitle>}
            {goalId && <AllTodoList goalId={goalId} options={options} />}
            {goalId && (
                <div className="mt-6">
                    <TodoForm goalId={goalId} />
                </div>
            )}
        </div>
    );
};

const AllTodoList = ({
    goalId,
    options,
}: {
    goalId: string;
    options?: TodoItemOptions;
}) => {
    const todosQuery = trpc.todo.getTodos.useQuery({
        goalIds: [goalId],
    });
    const todos = todosQuery.data?.todos ?? [];

    return (
        <TodosList
            todos={todos}
            loading={todosQuery.isLoading}
            options={options}
        />
    );
};
