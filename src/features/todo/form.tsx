import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Button } from "../ui/button";

const schema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
});

type Schema = z.infer<typeof schema>;

export const TodoForm = ({
  goalId,
  onSuccess,
}: {
  goalId: string;
  onSuccess: () => void;
}) => {
  const addTodoMutation = trpc.todo.createTodo.useMutation();
  const form = useForm<Schema>({
    defaultValues: { title: "", description: "" },
    resolver: zodResolver(schema),
  });
  const onSubmit = form.handleSubmit((values) => {
    addTodoMutation.mutate(
      { ...values, goalId },
      {
        onSuccess: () => {
          form.reset();
          onSuccess();
        },
      }
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex">
      <div className="flex items-stretch rounded-sm border-2 border-neutral-700">
        <input
          placeholder="What you want to do?"
          autoFocus
          className="grow px-2 py-0.5 focus:outline-0"
          {...form.register("title")}
        />
        <Button
          type="submit"
          loading={addTodoMutation.isLoading}
          variant="filled"
        >
          Save
        </Button>
      </div>
    </form>
  );
};
