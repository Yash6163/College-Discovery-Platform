import { fail, ok } from "@/lib/api";
import { getCollege } from "@/services/college-service";
export async function GET(_: Request, { params }: { params: Promise<{ idOrSlug: string }> }) { try { const college = await getCollege((await params).idOrSlug); return college ? ok(college) : fail(404, "NOT_FOUND", "College not found."); } catch { return fail(500, "INTERNAL_ERROR", "Unable to load college information."); } }
