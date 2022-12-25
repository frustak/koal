import { z } from "zod";

import { prisma } from "../../db/client";
import { protectedProcedure, router } from "../trpc";

export const planningRouter = router({
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
          start: z.date().optional(),
          end: z.date().optional(),
        }),
        focusGoal: z.object({
          name: z.string().optional(),
          id: z.string().optional(),
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
      const dayFocus = await prisma.dayFocus.findFirst({
        where: {
          ownerId: ctx.session.user.id,
          date: new Date(new Date().setHours(0, 0, 0, 0)),
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
          start: dayFocus?.focusTimeStart,
          end: dayFocus?.focusTimeEnd,
        },
        focusGoal: {
          name: dayFocus?.Goal.name,
          id: dayFocus?.Goal.id,
        },
      };
    }),
});
