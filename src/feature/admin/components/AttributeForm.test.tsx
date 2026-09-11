import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AttributeForm from "./AttributeForm";

const emptyValues = { key: "", valueEn: "", valueIs: "" };

describe("AttributeForm", () => {
  it("pre-fills the fields from initialValues", () => {
    render(
      <AttributeForm
        initialValues={{
          key: "category",
          valueEn: "Blanket",
          valueIs: "Teppi",
        }}
        submitLabel="Save"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Category");
    expect(screen.getByLabelText("Value (Icelandic)")).toHaveValue("Teppi");
    expect(screen.getByLabelText("Value (English)")).toHaveValue("Blanket");
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onSubmit with the current field values when submitted", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <AttributeForm
        initialValues={emptyValues}
        submitLabel="Add attribute"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Category" }));
    await userEvent.type(screen.getByLabelText("Value (Icelandic)"), "Teppi");
    await userEvent.type(screen.getByLabelText("Value (English)"), "Blanket");
    await userEvent.click(
      screen.getByRole("button", { name: "Add attribute" }),
    );

    expect(handleSubmit).toHaveBeenCalledWith({
      key: "category",
      valueIs: "Teppi",
      valueEn: "Blanket",
    });
  });

  it("shows an error message when onSubmit throws", async () => {
    const handleSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Value is required."));
    render(
      <AttributeForm
        initialValues={emptyValues}
        submitLabel="Add attribute"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add attribute" }),
    );

    expect(screen.getByText("Value is required.")).toBeInTheDocument();
  });

  it("falls back to a generic error message when onSubmit throws a non-Error value", async () => {
    const handleSubmit = vi.fn().mockRejectedValue("network blew up");
    render(
      <AttributeForm
        initialValues={emptyValues}
        submitLabel="Add attribute"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add attribute" }),
    );

    expect(
      screen.getByText("something went wrong. Try again"),
    ).toBeInTheDocument();
  });
});
