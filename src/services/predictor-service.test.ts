import { describe, expect, it } from "vitest";
import { classifyRank } from "./predictor-service";
describe("predictor classification", () => { it("classifies safe, moderate and ambitious choices", () => { expect(classifyRank(8000, 10000)).toBe("SAFE"); expect(classifyRank(9500, 10000)).toBe("MODERATE"); expect(classifyRank(11000, 10000)).toBe("AMBITIOUS"); }); it("excludes ranks beyond the ambitious band", () => expect(classifyRank(11501, 10000)).toBeNull()); });
