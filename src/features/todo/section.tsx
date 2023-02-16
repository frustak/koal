import { useState } from "react";
import { Button } from "../ui/button";
import { Title } from "../ui/title";
import { TodoForm } from "./form";
import { TodosList } from "./list";

export const TodosSection = ({ goalId }: { goalId: string | null }) => {
    const [isAddingTodo, setIsAddingTodo] = useState(false);
    const onClickAddTodo = () => setIsAddingTodo(true);
    const onAddTodo = () => setIsAddingTodo(false);

    return (
        <div className="flex flex-col">
            <Title>Todos</Title>
            {!goalId && <p>Select a goal to see todos</p>}
            {goalId && <TodosList goalId={goalId} />}
            {goalId && (
                <div className="mt-6">
                    {isAddingTodo && (
                        <TodoForm goalId={goalId} onSuccess={onAddTodo} />
                    )}
                    {!isAddingTodo && (
                        <Button onClick={onClickAddTodo}>Add Todo</Button>
                    )}
                </div>
            )}
        </div>
    );
};
