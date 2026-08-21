import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getCollege } from "@/services/college-service";
import { reviewSchema } from "@/validations/college";
export async function GET(_: Request, { params }: { params: Promise<{ idOrSlug: string }> }) { const college = await getCollege((await params).idOrSlug); if (!college) return fail(404, "NOT_FOUND", "College not found."); return ok(college.reviews); }
export async function POST(request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) { const body = await request.json().catch(() => null); const parsed = reviewSchema.safeParse(body); if (!parsed.success) return fail(400, "VALIDATION_ERROR", "Invalid review data", parsed.error.flatten()); const college = await getCollege((await params).idOrSlug); if (!college) return fail(404, "NOT_FOUND", "College not found."); try { return ok(await prisma.review.create({ data: { ...parsed.data, collegeId: college.id } })); } catch { return fail(500, "INTERNAL_ERROR", "Unable to submit review."); } }
