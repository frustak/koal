import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";

export const todoRouter = router({
  createTodoProject: protectedProcedure
    .input(z.object({ name: z.string() }))
    .output(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.todoProject.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
        },
      });
      return { name: project.name, id: project.id };
    }),
  getTodoProjects: protectedProcedure
    .output(
      z.object({
        projects: z.array(z.object({ name: z.string(), id: z.string() })),
      })
    )
    .query(async ({ ctx }) => {
      const projects = await prisma.todoProject.findMany({
        where: { ownerId: ctx.session.user.id },
      });

      return {
        projects: projects,
      };
    }),
  createTodoItem: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().nullable(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      prisma.todoItem.create({
        data: {
          title: input.title,
          description: input.description,
          projectId: input.projectId,
        },
      });
      return {};
    }),
  getTodoItems: protectedProcedure
    .input(
      z.object({
        projectIds: z.array(z.string()).default([]),
      })
    )
    .output(
      z.object({
        todoItems: z.array(
          z.object({
            title: z.string(),
            isDone: z.boolean(),
            projectName: z.string(),
          })
        ),
      })
    )
    .query(async ({ input, ctx }) => {
      const todoItems = await prisma.todoItem.findMany({
        where: {
          projectId: { in: input.projectIds },
          TodoProject: { ownerId: ctx.session.user.id },
        },
        include: { TodoProject: true },
      });

      return {
        todoItems: todoItems.map((todoItem) => ({
          title: todoItem.title,
          isDone: false,
          projectName: todoItem.TodoProject.name,
        })),
      };
    }),
});
