import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";

export const todoRouter = router({
  setDayFocus: protectedProcedure
    .input(
      z.object({
        goalId: z.string(),
        focusTimeStart: z
          .date()
          .min(new Date(new Date().setHours(0, 0, 0, 0)))
          .max(new Date(new Date().setHours(11, 59, 59, 0))),
        focusTimeEnd: z
          .date()
          .min(new Date(new Date().setHours(0, 0, 0, 0)))
          .max(new Date(new Date().setHours(11, 59, 59, 0))),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.dayFocus.create({
        data: {
          goalId: input.goalId,
          ownerId: ctx.session.user.id,
          focusTimeStart: input.focusTimeStart,
          focusTimeEnd: input.focusTimeEnd,
        },
      });
    }),
  inbox: protectedProcedure
    .output(
      z.object({
        todos: z.array(
          z.object({
            title: z.string(),
            isDone: z.boolean(),
            goalName: z.string(),
          })
        ),
        focusTime: z.object({
          start: z.date(),
          end: z.date(),
        }),
      })
    )
    .query(async ({ ctx }) => {
      const todos = await prisma.todo.findMany({
        where: {
          NOT: [
            {
              isDone: {
                not: undefined,
              },
            },
          ],
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
        focusTime: {
          start: new Date(),
          end: new Date(),
        },
      };
    }),
});
