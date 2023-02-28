import clsx from "clsx";
import { Check, Eraser } from "phosphor-react";
import type { Todo } from "../../server/trpc/router/todo";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../ui/button";
import { Loader } from "../ui/loader";
import { Subtitle } from "../ui/title";

export const TodosList = ({
    todos,
    loading,
    emptyMessage = "Nothing to do but chill, stay frosty ❄️",
}: {
    todos: Todo[];
    loading?: boolean;
    emptyMessage?: string;
}) => {
    if (loading) return <Loader />;
    if (todos.length === 0) return <Subtitle>{emptyMessage}</Subtitle>;

    const ordered = [...todos].sort((a, b) =>
        a.priority === "urgent" && b.priority === "not_urgent"
            ? -1
            : b.priority === "urgent" && a.priority === "not_urgent"
            ? 1
            : 0
    );

    return (
        <ul className="space-y-3">
            {ordered.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </ul>
    );
};

export const TodoItem = ({ todo }: { todo: Todo }) => {
    const updateMutation = trpc.todo.updateTodoStatus.useMutation();
    const deleteMutation = trpc.todo.deleteTodo.useMutation();
    const isDone = !!todo.isDone;
    const toggleDone = () => {
        updateMutation.mutate({ id: todo.id, isDone: !isDone });
    };
    const deleteTodo = () => {
        deleteMutation.mutate({ todoId: todo.id });
    };

    return (
        <li className="flex items-center justify-between gap-6">
            <div className="flex grow items-center gap-4">
                <IconButton
                    onClick={toggleDone}
                    loading={updateMutation.isLoading}
                >
                    {isDone && <Check weight="duotone" />}
                </IconButton>
                <div className="flex grow items-center justify-between">
                    <p className={clsx(isDone && "line-through")}>
                        {todo.title}
                    </p>
                    <p className="bg-neutral-50 text-xs text-neutral-500">
                        {todo.priority === "not_urgent" && "someday"}
                    </p>
                </div>
            </div>
            <IconButton onClick={deleteTodo} loading={deleteMutation.isLoading}>
                <Eraser weight="duotone" />
            </IconButton>
        </li>
    );
};
