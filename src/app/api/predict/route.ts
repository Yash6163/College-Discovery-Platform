import { fail, ok } from "@/lib/api";
import { predict } from "@/services/predictor-service";
import { predictSchema } from "@/validations/college";
export async function GET(request: Request) { const parsed = predictSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams)); if (!parsed.success) return fail(400, "VALIDATION_ERROR", "Enter a valid exam and rank.", parsed.error.flatten()); try { const recommendations = await predict(parsed.data.exam, parsed.data.rank); return ok({ ...parsed.data, disclaimer: "Recommendations use demo historical/generated cutoff data and are not official admission predictions.", recommendations }); } catch { return fail(500, "INTERNAL_ERROR", "Unable to calculate recommendations."); } }
