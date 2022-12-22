import { trpc } from "../../utils/trpc";
import { Loader } from "../ui/loader";

export const TodosList = ({ goalId }: { goalId: string }) => {
  const todosQuery = trpc.todo.getTodos.useQuery({ goalIds: [goalId] });
  const todos = todosQuery.data?.todos ?? [];

  if (todosQuery.isLoading) return <Loader />;
  if (todos.length === 0) return <p>No todos</p>;

  return (
    <ul className="list-inside list-disc space-y-3">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};
