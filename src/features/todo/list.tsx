import clsx from "clsx";
import { Check, Eraser } from "phosphor-react";
import type { Todo } from "../../server/trpc/router/todo";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../ui/button";
import { Loader } from "../ui/loader";

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
    if (todos.length === 0) return <p className="text-xs">{emptyMessage}</p>;

    return (
        <ul className="space-y-3">
            {todos.map((todo) => (
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
        <li className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <IconButton
                    onClick={toggleDone}
                    loading={updateMutation.isLoading}
                >
                    {isDone && <Check weight="duotone" />}
                </IconButton>
                <span className={clsx(isDone && "line-through")}>
                    {todo.title}
                </span>
            </div>
            <IconButton onClick={deleteTodo} loading={deleteMutation.isLoading}>
                <Eraser weight="duotone" />
            </IconButton>
        </li>
    );
};
