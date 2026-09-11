import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadAsset } from "./uploadAsset";

vi.mock("@/shared/lib/client", () => ({
  createClient: () => mockSupabase,
}));

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockStorageFrom = vi.fn(() => ({
  upload: mockUpload,
  getPublicUrl: mockGetPublicUrl,
}));

const mockSupabase = { storage: { from: mockStorageFrom } };

function makeFile({
  name = "photo.png",
  size = 1024,
}: { name?: string; size?: number } = {}) {
  const file = new File(["fake image content"], name, { type: "image/png" });
  // File.size is normally derived from its content; we override it here so
  // we can test the size-limit check without allocating a real large file.
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("uploadAsset", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStorageFrom.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    });

    // Fixed UUID so the generated file path is predictable in assertions.
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    );
  });

  it("throws when the file is larger than the size limit", async () => {
    const bigFile = makeFile({ size: 2 * 1024 * 1024 });

    await expect(uploadAsset(bigFile, "product-1")).rejects.toThrow(
      "Image is too large - please use a file under 1MB",
    );
    expect(mockStorageFrom).not.toHaveBeenCalled();
  });

  it("uploads the file and returns the public URL on success", async () => {
    mockUpload.mockResolvedValueOnce({ error: null });
    mockGetPublicUrl.mockReturnValueOnce({
      data: { publicUrl: "https://example.com/product-images/photo.png" },
    });

    const file = makeFile();
    const result = await uploadAsset(file, "product-1");

    expect(mockStorageFrom).toHaveBeenCalledWith("product-images");
    expect(mockUpload).toHaveBeenCalledWith(
      "product-1/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png",
      file,
    );
    expect(result).toBe("https://example.com/product-images/photo.png");
  });

  it("throws when the upload fails", async () => {
    const storageError = { message: "Storage error" };
    mockUpload.mockResolvedValueOnce({ error: storageError });

    const file = makeFile();

    await expect(uploadAsset(file, "product-1")).rejects.toEqual(storageError);
  });
});
