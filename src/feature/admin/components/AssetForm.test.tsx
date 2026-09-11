import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AssetForm from "./AssetForm";
import type { ProductVariant } from "@/shared/types/product";

const variants = [
  { id: "variant-1", name: { en: "Blue", is: "Blár" } },
  { id: "variant-2", name: { en: "Red", is: "Rauður" } },
] as ProductVariant[];

function makeFile(name = "photo.png") {
  return new File(["fake image content"], name, { type: "image/png" });
}

describe("AssetForm", () => {
  it("shows an error and does not submit when no file is chosen", async () => {
    const handleSubmit = vi.fn();
    render(
      <AssetForm
        variants={variants}
        submitLabel="Upload"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Upload" }));

    expect(
      screen.getByText("Please choose an image to upload."),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the file, selected variant, and alt text", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <AssetForm
        variants={variants}
        submitLabel="Upload"
        onSubmit={handleSubmit}
      />,
    );

    const file = makeFile();
    await userEvent.upload(screen.getByLabelText("Image"), file);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Blue" }));
    await userEvent.type(screen.getByLabelText("Alt text"), "A blue mitten");
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      file,
      variantId: "variant-1",
      altText: "A blue mitten",
    });
  });

  it("clears the file and alt text after a successful submit", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <AssetForm
        variants={variants}
        submitLabel="Upload"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.upload(screen.getByLabelText("Image"), makeFile());
    await userEvent.type(screen.getByLabelText("Alt text"), "A blue mitten");
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));

    expect(screen.getByLabelText("Alt text")).toHaveValue("");
  });

  it("shows an error message when onSubmit throws", async () => {
    const handleSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Failed to upload image."));
    render(
      <AssetForm
        variants={variants}
        submitLabel="Upload"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.upload(screen.getByLabelText("Image"), makeFile());
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));

    expect(screen.getByText("Failed to upload image.")).toBeInTheDocument();
  });

  it("falls back to a generic error message when onSubmit throws a non-Error value", async () => {
    const handleSubmit = vi.fn().mockRejectedValue("network blew up");
    render(
      <AssetForm
        variants={variants}
        submitLabel="Upload"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.upload(screen.getByLabelText("Image"), makeFile());
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));

    expect(
      screen.getByText("something went wrong. Try again."),
    ).toBeInTheDocument();
  });
});
