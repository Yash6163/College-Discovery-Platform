import { z } from "zod";
const num = (min: number, max: number) => z.coerce.number().int().min(min).max(max);
export const collegeQuerySchema = z.object({
  search: z.string().trim().max(100).optional(), state: z.string().trim().max(60).optional(), city: z.string().trim().max(60).optional(),
  type: z.enum(["GOVERNMENT", "PRIVATE", "DEEMED", "AUTONOMOUS"]).optional(), course: z.string().trim().max(80).optional(),
  minFee: num(0, 10000000).optional(), maxFee: num(0, 10000000).optional(), minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating_desc", "fee_asc", "fee_desc", "name_asc"]).default("rating_desc"), page: num(1, 10000).default(1), limit: num(1, 50).default(12)
}).refine(v => !v.minFee || !v.maxFee || v.minFee <= v.maxFee, { message: "minFee must not exceed maxFee", path: ["minFee"] });
export const reviewSchema = z.object({ displayName: z.string().trim().min(2).max(60), rating: z.number().min(1).max(5), title: z.string().trim().min(5).max(120), body: z.string().trim().min(20).max(2000) });
export const predictSchema = z.object({ exam: z.enum(["JEE_MAIN", "NEET_UG", "CAT"]), rank: num(1, 2000000) });
