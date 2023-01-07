import type { NextPage } from "next";
import { TodoItem } from "../features/todo/list";
import { Title } from "../features/ui/title";
import { trpc } from "../utils/trpc";

const DayViewPage: NextPage = () => {
    const inboxQuery = trpc.planning.inbox.useQuery();
    const todos = inboxQuery.data?.todos;
    const todoGroupedByGoal = todos?.reduce((acc, todo) => {
        const goal = todo.goalName;
        if (!acc[goal] || !Array.isArray(acc[goal])) {
            acc[goal] = [];
        }
        else {
            acc[goal]?.push(todo);
        }
        return acc;
    }, {} as Record<string, typeof todos>);

    if (todoGroupedByGoal === undefined) {
        return <div>Loading...</div>;
    }


    return (
        <main className="flex grow flex-col">
            {todoGroupedByGoal && Object.entries(todoGroupedByGoal).map(([goal, todos]) => (
                <div key={goal}>
                    <Title>{goal}</Title>
                    <ul>
                        {todos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </ul>
                </div>
            ))}

        </main>
    );
};

export default DayViewPage;
