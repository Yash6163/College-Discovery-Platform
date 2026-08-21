import { collegeQuerySchema } from "@/validations/college";
import { listColleges } from "@/services/college-service";
import { fail, ok } from "@/lib/api";
export async function GET(request: Request) { const parsed = collegeQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams)); if (!parsed.success) return fail(400, "VALIDATION_ERROR", "Invalid college search parameters", parsed.error.flatten()); try { const result = await listColleges(parsed.data); return ok(result.items, result.meta); } catch { return fail(500, "INTERNAL_ERROR", "Unable to load colleges. Please try again."); } }
