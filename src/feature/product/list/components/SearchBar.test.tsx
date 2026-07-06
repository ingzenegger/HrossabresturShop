import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import i18n from "@/shared/i18n/i18n";
import SearchBar from "./SearchBar";

describe("SearchBar translations", () => {
  it("renders English strings when language is en", async () => {
    await i18n.changeLanguage("en");
    render(<SearchBar products={[]} query="zz" onQueryChange={() => {}} />);

    expect(
      screen.getByPlaceholderText("Search products..."),
    ).toBeInTheDocument();
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("renders Icelandic strings when language is is", async () => {
    await i18n.changeLanguage("is");
    render(<SearchBar products={[]} query="zz" onQueryChange={() => {}} />);

    expect(screen.getByPlaceholderText("Leita að vöru...")).toBeInTheDocument();
    expect(screen.getByText("Ekkert fannst.")).toBeInTheDocument();
  });
});
