import { describe, expect, it } from "vitest";
import { collegeQuerySchema, predictSchema } from "./college";
describe("college query validation", () => { it("rejects inverted fee ranges", () => expect(collegeQuerySchema.safeParse({ minFee: "90000", maxFee: "10000" }).success).toBe(false)); it("sets pagination defaults", () => expect(collegeQuerySchema.parse({}).page).toBe(1)); it("rejects invalid rank", () => expect(predictSchema.safeParse({ exam: "JEE_MAIN", rank: 0 }).success).toBe(false)); });
