import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createCaseSchema = z.object({
  fullName: z.string().min(2, "Full name is too short").max(100),
  age: z.coerce.number().int().min(0).max(120),
  gender: z.enum(["Male", "Female", "Other"]),
  height: z.string().min(1).max(20).optional(),
  physicalDescription: z.string().min(10).max(1000),
  clothingLastSeen: z.string().min(3).max(500),
  lastKnownLocation: z.string().min(2).max(200),
  dateLastSeen: z.string().min(4).max(50),
  timeLastSeen: z.string().min(3).max(20),
  additionalInfo: z.string().max(1000).optional(),
});

export const updateCaseSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  age: z.coerce.number().int().min(0).max(120).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  height: z.string().min(1).max(20).optional(),
  physicalDescription: z.string().min(10).max(1000).optional(),
  clothingLastSeen: z.string().min(3).max(500).optional(),
  lastKnownLocation: z.string().min(2).max(200).optional(),
  dateLastSeen: z.string().min(4).max(50).optional(),
  timeLastSeen: z.string().min(3).max(20).optional(),
  additionalInfo: z.string().max(1000).optional(),
});

export const caseIdParamSchema = z.object({
  id: objectId,
});