import clsx from "clsx";
import { CaretDown, CaretUp, Check, Eraser, MoonStars } from "phosphor-react";
import type { Todo } from "../../server/trpc/router/todo";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../ui/button";
import { Loader } from "../ui/loader";
import { Subtitle } from "../ui/title";

export const TodosList = ({
    todos,
    loading,
    emptyMessage = "Nothing to do but chill, stay frosty ❄️",
    options,
}: {
    todos: Todo[];
    loading?: boolean;
    emptyMessage?: string;
    options?: TodoItemOptions;
}) => {
    const ordersMutation = trpc.todo.updateOrders.useMutation();

    const move = (todoId: string, direction: "up" | "down") => {
        const index = todos.findIndex((todo) => todo.id === todoId);
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const newTodos = [...todos];
        const todo = newTodos[index];
        const otherTodo = newTodos[targetIndex];
        if (!todo || !otherTodo) return;
        newTodos[index] = otherTodo;
        newTodos[targetIndex] = todo;
        const todoIds = newTodos.map((todo) => todo.id);
        console.log(newTodos.map((todo) => todo.title));
        ordersMutation.mutate({ todoIds });
    };

    if (loading) return <Loader />;
    if (todos.length === 0) return <Subtitle>{emptyMessage}</Subtitle>;

    return (
        <ul>
            {todos.map((todo, index) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    move={move}
                    isFirst={index === 0}
                    isLast={index === todos.length - 1}
                    orderLoading={ordersMutation.isLoading}
                    options={options}
                />
            ))}
        </ul>
    );
};

export type TodoItemOptions = {
    withMove?: boolean;
    withSnooze?: boolean;
};

export const TodoItem = ({
    todo,
    move,
    isFirst,
    isLast,
    orderLoading,
    options,
}: {
    todo: Todo;
    move: (todoId: string, direction: "up" | "down") => void;
    isFirst: boolean;
    isLast: boolean;
    orderLoading: boolean;
    options?: TodoItemOptions;
}) => {
    const updateMutation = trpc.todo.updateTodoStatus.useMutation();
    const deleteMutation = trpc.todo.deleteTodo.useMutation();
    const snoozeMutation = trpc.todo.snoozeTodo.useMutation();

    const isDone = !!todo.isDone;

    const toggleDone = () => {
        updateMutation.mutate({ id: todo.id, isDone: !isDone });
    };
    const deleteTodo = () => {
        deleteMutation.mutate({ todoId: todo.id });
    };
    const moveUp = () => {
        move(todo.id, "up");
    };
    const moveDown = () => {
        move(todo.id, "down");
    };
    const snooze = () => {
        snoozeMutation.mutate({ todoId: todo.id });
    };

    return (
        <li className="group flex items-center justify-between gap-6 rounded-sm py-1 px-2 hover:bg-neutral-50">
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
            <div className="invisible flex items-center gap-2 group-hover:visible">
                {options?.withSnooze && (
                    <IconButton
                        onClick={snooze}
                        loading={snoozeMutation.isLoading}
                        title="Snooze"
                    >
                        <MoonStars weight="duotone" />
                    </IconButton>
                )}
                {options?.withMove && (
                    <div className="flex flex-col gap-1">
                        <IconButton
                            className="!h-4 !w-4 !text-xs"
                            onClick={moveUp}
                            disabled={isFirst}
                            loading={orderLoading}
                            title="Move up"
                        >
                            <CaretUp weight="duotone" />
                        </IconButton>
                        <IconButton
                            className="!h-4 !w-4 !text-xs"
                            onClick={moveDown}
                            disabled={isLast}
                            loading={orderLoading}
                            title="Move down"
                        >
                            <CaretDown weight="duotone" />
                        </IconButton>
                    </div>
                )}
                <IconButton
                    onClick={deleteTodo}
                    loading={deleteMutation.isLoading}
                    title="Delete"
                >
                    <Eraser weight="duotone" />
                </IconButton>
            </div>
        </li>
    );
};
