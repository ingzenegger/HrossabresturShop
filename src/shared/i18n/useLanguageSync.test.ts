import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/shared/store/appStore";
import { useLanguageSync } from "./useLanguageSync";
import i18n from "./i18n";

describe("useLanguageSync", () => {
  beforeEach(async () => {
    useAppStore.setState({ language: "is" });
    await i18n.changeLanguage("is");
    document.documentElement.lang = "";
  });

  it("applies the store language on mount", async () => {
    renderHook(() => useLanguageSync());

    await waitFor(() => expect(i18n.language).toBe("is"));
    expect(document.documentElement.lang).toBe("is");
  });

  it("follows the store when setLanguage is called", async () => {
    renderHook(() => useLanguageSync());

    act(() => {
      useAppStore.getState().setLanguage("en");
    });

    await waitFor(() => expect(i18n.language).toBe("en"));
    expect(document.documentElement.lang).toBe("en");
  });

  it("serves translations in the new language", async () => {
    renderHook(() => useLanguageSync());

    act(() => {
      useAppStore.getState().setLanguage("en");
    });

    await waitFor(() => expect(i18n.t("checkout.paymentDetails")).toBe("Payment Details"));
  });
});