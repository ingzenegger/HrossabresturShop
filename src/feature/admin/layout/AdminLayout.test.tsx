import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import AdminLayout from "./AdminLayout";

// AdminSidebar has (or will have) its own test file — here we only care
// that AdminLayout renders it, not what it does internally.
const mockAdminSidebar = vi.hoisted(() => vi.fn(() => null));
vi.mock("./AdminSidebar", () => ({
  default: mockAdminSidebar,
}));

const { mockStore } = vi.hoisted(() => {
  const mockStore: { user: unknown; userRole: unknown } = {
    user: undefined,
    userRole: undefined,
  };
  return { mockStore };
});
vi.mock("@/shared/store/appStore", () => {
  const useAppStore = (selector: (state: typeof mockStore) => unknown) =>
    selector(mockStore);
  return { useAppStore };
});

// A real MemoryRouter with actual routes, so we can check that a redirect
// really lands on the right page, and that <Outlet /> renders nested
// route content for an admin.
function renderLayout(initialPath = "/admin") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Admin content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading message while the user/role haven't loaded yet", () => {
    mockStore.user = undefined;
    mockStore.userRole = undefined;

    renderLayout();

    expect(screen.getByText("loading user")).toBeInTheDocument();
  });

  it("redirects to the login page when there is no user", () => {
    mockStore.user = null;
    mockStore.userRole = null;

    renderLayout();

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects to the home page when the user is not an admin", () => {
    mockStore.user = { id: "user-1" };
    mockStore.userRole = "customer";

    renderLayout();

    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("renders the sidebar and the nested route content for an admin user", () => {
    mockStore.user = { id: "user-1" };
    mockStore.userRole = "admin";

    renderLayout();

    expect(mockAdminSidebar).toHaveBeenCalled();
    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });
});