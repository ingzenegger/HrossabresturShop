import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import AdminSidebar from "./AdminSidebar";

// LogOut has (or will have) its own test file — here we only care that
// AdminSidebar renders it, not what it does internally.
const mockLogOut = vi.hoisted(() => vi.fn(() => null));
vi.mock("@/feature/auth/components/logout", () => ({
  default: mockLogOut,
}));

function renderSidebar(initialPath = "/admin/products") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AdminSidebar />
    </MemoryRouter>,
  );
}

describe("AdminSidebar", () => {
  it("renders both navigation links with the correct hrefs", () => {
    renderSidebar();

    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/admin/products",
    );
    expect(screen.getByRole("link", { name: "Add product" })).toHaveAttribute(
      "href",
      "/admin/add",
    );
  });

  it("highlights 'Products' when on the products page", () => {
    renderSidebar("/admin/products");

    expect(screen.getByRole("link", { name: "Products" })).toHaveClass(
      "bg-amber-200",
    );
    expect(screen.getByRole("link", { name: "Add product" })).not.toHaveClass(
      "bg-amber-200",
    );
  });

  it("highlights 'Add product' when on the add-product page", () => {
    renderSidebar("/admin/add");

    expect(screen.getByRole("link", { name: "Add product" })).toHaveClass(
      "bg-amber-200",
    );
    expect(screen.getByRole("link", { name: "Products" })).not.toHaveClass(
      "bg-amber-200",
    );
  });

  it("renders the logout control", () => {
    renderSidebar();

    expect(mockLogOut).toHaveBeenCalled();
  });
});