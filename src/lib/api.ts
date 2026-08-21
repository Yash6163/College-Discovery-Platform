import { NextResponse } from "next/server";
export const ok = <T>(data: T, meta?: Record<string, unknown>) => NextResponse.json(meta ? { data, meta } : { data });
export const fail = (status: number, code: string, message: string, details?: unknown) => NextResponse.json({ error: { code, message, ...(details ? { details } : {}) } }, { status });
