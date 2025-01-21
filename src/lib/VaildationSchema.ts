import { z } from "zod";

export const dispatchRegisterSchema = z.object({
  challanNo: z
    .string()
    .min(3, "Challan number must have at least 3 characters"),
  challanDate: z
    .string()
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.valueOf()), "Invalid date format")
    .optional(),
  partyName: z.string().min(3, "Party name must have at least 3 characters"),
  partyPlace: z
    .string()
    .min(3, "Place name must have at least 3 characters")
    .optional(),
  orderAmt: z.number().optional(),
  partyCode: z
    .string()
    .min(1)
    .optional()
    .nullable()
    .transform((value) => value ?? undefined),
  transportName: z
    .string()
    .min(1, "Transport name must have at least 1 character")
    .optional(),
});

export type DispatchRegister = z.infer<typeof dispatchRegisterSchema>;

export const dispatchUpdateSchema = z.object({
  challanDate: z
    .string()
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.valueOf()), "Invalid date format")
    .optional(),
  partyPlace: z
    .string()
    .min(3, "Place name must have at least 3 characters")
    .optional(),
  orderAmt: z.number().optional(),
  partyCode: z
    .string()
    .min(1)
    .optional()
    .nullable()
    .transform((value) => value ?? undefined),
  transportName: z
    .string()
    .min(1, "Transport name must have at least 1 character")
    .optional(),
});

export type DispatchUpdate = z.infer<typeof dispatchUpdateSchema>;
