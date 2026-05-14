import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { createLead, getAllLeads, createContactSubmission, getAllContactSubmissions } from "./db";

// Validation schemas
const createLeadSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  practiceName: z.string().optional(),
  phone: z.string().optional(),
  interestType: z.enum(["trial", "demo", "pricing", "general"]).default("general"),
  message: z.string().optional(),
});

const createContactSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      return { success: true } as const;
    }),
  }),

  leads: router({
    create: publicProcedure
      .input(createLeadSchema)
      .mutation(async ({ input }) => {
        try {
          await createLead({
            email: input.email,
            name: input.name,
            practiceName: input.practiceName,
            phone: input.phone,
            interestType: input.interestType,
            message: input.message,
          });
          return { success: true, message: "Lead created successfully" };
        } catch (error) {
          console.error("Failed to create lead:", error);
          throw new Error("Failed to create lead");
        }
      }),

    list: publicProcedure
      .query(async () => {
        try {
          const leads = await getAllLeads();
          return leads;
        } catch (error) {
          console.error("Failed to fetch leads:", error);
          return [];
        }
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(createContactSchema)
      .mutation(async ({ input }) => {
        try {
          await createContactSubmission({
            email: input.email,
            name: input.name,
            subject: input.subject,
            message: input.message,
          });
          return { success: true, message: "Message sent successfully" };
        } catch (error) {
          console.error("Failed to submit contact form:", error);
          throw new Error("Failed to submit contact form");
        }
      }),

    list: publicProcedure
      .query(async () => {
        try {
          const submissions = await getAllContactSubmissions();
          return submissions;
        } catch (error) {
          console.error("Failed to fetch contact submissions:", error);
          return [];
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
