import { prisma } from "@/lib/prisma";
export type PredictionBand = "SAFE" | "MODERATE" | "AMBITIOUS";
export function classifyRank(rank: number, closingRank: number): PredictionBand | null { if (rank <= closingRank * .85) return "SAFE"; if (rank <= closingRank) return "MODERATE"; if (rank <= closingRank * 1.15) return "AMBITIOUS"; return null; }
export async function predict(exam: "JEE_MAIN" | "NEET_UG" | "CAT", rank: number) {
  const cutoffs = await prisma.cutoff.findMany({ where: { exam, category: "OPEN", year: 2025, closingRank: { gte: Math.floor(rank / 1.15) } }, orderBy: { closingRank: "asc" }, include: { college: { include: { placements: { orderBy: { year: "desc" }, take: 1 }, courses: { take: 3 } } } }, take: 40 });
  return cutoffs.map(cutoff => ({ college: cutoff.college, cutoff: { year: cutoff.year, openingRank: cutoff.openingRank, closingRank: cutoff.closingRank, category: cutoff.category }, classification: classifyRank(rank, cutoff.closingRank), explanation: rank <= cutoff.closingRank * .85 ? "Your rank is comfortably ahead of this historical closing rank." : rank <= cutoff.closingRank ? "Your rank falls within this historical cutoff range." : "This is slightly beyond the historical closing rank, so consider it aspirational." })).filter(item => item.classification);
}
