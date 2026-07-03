import { describe, it, expect } from "vitest";
import en from "./locales/en.json";
import is from "./locales/is.json";

function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null
      ? collectKeys(value as Record<string, unknown>, path)
      : [path];
  });
}

function collectEmptyKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      return collectEmptyKeys(value as Record<string, unknown>, path);
    }
    return value === "" ? [path] : [];
  });
}

describe("translation files", () => {
  it("en.json and is.json have identical keys", () => {
    const enKeys = collectKeys(en).sort();
    const isKeys = collectKeys(is).sort();

    expect(
      enKeys.filter((k) => !isKeys.includes(k)),
      "keys missing from is.json",
    ).toEqual([]);
    expect(
      isKeys.filter((k) => !enKeys.includes(k)),
      "keys missing from en.json",
    ).toEqual([]);
  });

  it("no translation is an empty string", () => {
    expect(collectEmptyKeys(en), "empty strings in en.json").toEqual([]);
    expect(collectEmptyKeys(is), "empty strings in is.json").toEqual([]);
  });
});