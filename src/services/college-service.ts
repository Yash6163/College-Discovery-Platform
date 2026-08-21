import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { collegeQuerySchema } from "@/validations/college";
type Query = z.infer<typeof collegeQuerySchema>;
const listingInclude = { courses: { select: { name: true, degree: true }, take: 3 }, placements: { orderBy: { year: "desc" as const }, take: 1, select: { averagePackage: true, placementPercentage: true } } };
export async function listColleges(query: Query) {
  const where: Prisma.CollegeWhereInput = {
    ...(query.search ? { OR: [{ name: { contains: query.search, mode: "insensitive" } }, { city: { contains: query.search, mode: "insensitive" } }, { state: { contains: query.search, mode: "insensitive" } }] } : {}),
    ...(query.state ? { state: { equals: query.state, mode: "insensitive" } } : {}), ...(query.city ? { city: { equals: query.city, mode: "insensitive" } } : {}), ...(query.type ? { type: query.type } : {}),
    ...(query.minRating ? { rating: { gte: query.minRating } } : {}), ...(query.minFee || query.maxFee ? { annualFee: { ...(query.minFee ? { gte: query.minFee } : {}), ...(query.maxFee ? { lte: query.maxFee } : {}) } } : {}),
    ...(query.course ? { courses: { some: { name: { contains: query.course, mode: "insensitive" } } } } : {})
  };
  const orderBy = query.sort === "fee_asc" ? { annualFee: "asc" as const } : query.sort === "fee_desc" ? { annualFee: "desc" as const } : query.sort === "name_asc" ? { name: "asc" as const } : { rating: "desc" as const };
  const [items, total] = await prisma.$transaction([prisma.college.findMany({ where, orderBy, skip: (query.page - 1) * query.limit, take: query.limit, include: listingInclude }), prisma.college.count({ where })]);
  return { items, meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
}
export async function getCollege(idOrSlug: string) { return prisma.college.findFirst({ where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] }, include: { courses: { orderBy: { annualFee: "asc" } }, placements: { orderBy: { year: "desc" } }, cutoffs: { orderBy: { closingRank: "asc" }, take: 8 }, reviews: { orderBy: { createdAt: "desc" }, take: 5 } } }); }
export async function getComparison(ids: string[]) { const records = await prisma.college.findMany({ where: { OR: ids.flatMap(id => [{ id }, { slug: id }]) }, include: { courses: { select: { name: true, degree: true } }, placements: { orderBy: { year: "desc" }, take: 1 } } }); return ids.map(id => records.find(c => c.id === id || c.slug === id)).filter(Boolean); }
