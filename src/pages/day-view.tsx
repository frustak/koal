import type { NextPage } from "next";
import { TodoItem } from "../features/todo/list";
import { Loader } from "../features/ui/loader";
import { Title } from "../features/ui/title";
import { trpc } from "../utils/trpc";
import _ from "lodash";

const DayViewPage: NextPage = () => {
  const inboxQuery = trpc.planning.inbox.useQuery();
  const goalToTodos = inboxQuery.data?.goalToTodos ?? [];
  const focusGoal = inboxQuery.data?.focusGoal.name;

  if (inboxQuery.isLoading) return <Loader />;
  if (goalToTodos.length === 0)
    return <Title>Awesome you are done for today. Come back tomorrow</Title>;

  return (
    <main className="flex grow flex-col">
      {_.toPairs(goalToTodos).map(([goal, todos]) => (
        <div key={goal}>
          <Title>{goal == focusGoal ? `Focus ${goal}` : goal}</Title>
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
