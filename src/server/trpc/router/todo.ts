import { z } from "zod";

import { prisma } from "../../db/client";
import { protectedProcedure, router } from "../trpc";

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
  updateGoal: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const updatedTodo = await prisma.todo.update({
        data: {
          title: input.title,
        },
        where: {
          id: input.id,
        },
      });
      return updatedTodo;
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
    .mutation(async ({ input }) => {
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
    .output(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      const createdTodo = await prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          goalId: input.goalId,
        },
      });
      return createdTodo;
    }),
  updateTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      const updatedTodo = await prisma.todo.update({
        data: {
          title: input.title,
          description: input.description,
        },
        where: {
          id: input.id,
        },
      });
      return updatedTodo;
    }),
  updateTodoStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isDone: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.todo.update({
        data: {
          isDone: new Date(),
        },
        where: {
          id: input.id,
        },
      });
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
            id: z.string(),
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
          id: todo.id,
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
    .mutation(async ({ input }) => {
      prisma.todo.delete({
        where: { id: input.todoId },
      });
    }),
});
