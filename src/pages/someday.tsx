import _ from "lodash";
import type { NextPage } from "next";
import { TodoItem } from "../features/todo/list";
import { trpc } from "../utils/trpc";

const SomedayPage: NextPage = () => {
    const todoQuery = trpc.todo.getTodos.useQuery({ priority: "not_urgent" });
    const notUrgentTasks = todoQuery.data?.todos;
    if (!notUrgentTasks) {
        return <div> You are a true hero. Nothing to do. </div>;
    }
    return (
        <div>
            <ul>
                {_.forEach(notUrgentTasks).map((todo) => (
                    <TodoItem key={todo.id} todo={todo}></TodoItem>
                ))}
            </ul>
        </div>
    );
};

export default SomedayPage;
