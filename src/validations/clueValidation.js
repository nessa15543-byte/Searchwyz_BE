import { z } from "zod";

export const createClueSchema = z.object({
  location: z.string().min(3, "Location is too short").max(200),
  date: z.string().min(4, "Date is required").max(50),
  time: z.string().min(3, "Time is required").max(20),
  description: z.string().min(5, "Description is too short").max(1000),
});