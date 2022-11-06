import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";

export const todoRouter = router({
  createGoal: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const goal = await prisma.goal.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
        },
      });
      return { name: goal.name, id: goal.id };
    }),
  getGoals: protectedProcedure
    .output(
      z.object({
        goals: z.array(z.object({ name: z.string(), id: z.string() })),
      })
    )
    .query(async ({ ctx }) => {
      const goals = await prisma.goal.findMany({
        where: { ownerId: ctx.session.user.id },
      });

      return {
        goals: goals,
      };
    }),
  deleteGoal: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.goal.delete({
        where: { id: input.goalId },
      });
    }),
  createTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().nullable(),
        goalId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          goalId: input.goalId,
        },
      });
      return {};
    }),
  getTodos: protectedProcedure
    .input(
      z.object({
        goalIds: z.array(z.string()).default([]),
      })
    )
    .output(
      z.object({
        todos: z.array(
          z.object({
            title: z.string(),
            isDone: z.boolean(),
            goalName: z.string(),
          })
        ),
      })
    )
    .query(async ({ input, ctx }) => {
      const todos = await prisma.todo.findMany({
        where: {
          goalId: { in: input.goalIds },
          Goal: { ownerId: ctx.session.user.id },
        },
        include: { Goal: true },
      });

      return {
        todos: todos.map((todo) => ({
          title: todo.title,
          isDone: false,
          goalName: todo.Goal.name,
        })),
      };
    }),
  deleteTodo: protectedProcedure
    .input(
      z.object({
        todoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.todo.delete({
        where: { id: input.todoId },
      });
    }),
});
