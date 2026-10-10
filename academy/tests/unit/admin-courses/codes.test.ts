import { describe, expect, it } from "vitest";
import { normaliseCode, suggestLessonCode, suggestModuleCode } from "@/components/admin/courses/codes";

describe("codes", () => {
  it("normalises codes", () => {
    expect(normaliseCode(" m1t1 ")).toBe("M1T1");
    expect(normaliseCode("bonus-t2a")).toBe("BONUST2A");
  });

  it("suggests the next module code", () => {
    expect(suggestModuleCode([])).toBe("M0");
    expect(suggestModuleCode([{ code: "M0" }, { code: "M1" }, { code: "BONUS" }])).toBe("M2");
  });

  it("suggests the next lesson code in either style", () => {
    expect(suggestLessonCode("M1", [{ code: "M1T0" }, { code: "M1T1" }, { code: "M2T9" }])).toBe("M1T2");
    expect(suggestLessonCode("M1", [])).toBe("M1T1");
    expect(suggestLessonCode("BONUS", [{ code: "BONUS_T1" }, { code: "BONUS_T2a" }])).toBe("BONUS_T3");
    expect(suggestLessonCode("REPLAY", [])).toBe("REPLAY_T1");
  });
});
