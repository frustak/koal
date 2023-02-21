import { Title } from "../ui/title";
import { TodoForm } from "./form";
import { TodosList } from "./list";

export const TodosSection = ({ goalId }: { goalId: string | null }) => {
    return (
        <div className="flex flex-col">
            <Title>Todos</Title>
            {!goalId && <p>Select a goal to see todos</p>}
            {goalId && <TodosList goalId={goalId} />}
            {goalId && (
                <div className="mt-6">
                    <TodoForm goalId={goalId} />
                </div>
            )}
        </div>
    );
};
