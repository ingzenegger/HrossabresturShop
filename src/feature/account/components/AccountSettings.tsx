//TODO: set nameform as a seperate component?

import { useState } from "react";
import { Link } from "react-router";
import { useAppStore } from "@/shared/store/appStore";
import { updateCustomerName } from "@/feature/account/api/customerApi";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export default function AccountSettings() {
  const customerId = useAppStore((state) => state.customerId);
  const customerName = useAppStore((state) => state.customerName);
  const setCustomerName = useAppStore((state) => state.setCustomerName);

  const [nameInput, setNameInput] = useState(customerName ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    const ok = await updateCustomerName({
      customerId,
      name: nameInput,
      setCustomerName,
    });

    if (!ok) {
      setError("Failed to update name. Please try again.");
    } else {
      setSuccess(true);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Account Settings</h2>

      {/* Name update */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Your name"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Name updated!</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-fit cursor-pointer"
        >
          {loading ? "Saving..." : "Save name"}
        </Button>
      </form>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Password</p>
        <Link
          to="/account/update-password"
          className="text-sm text-amber-800 underline underline-offset-4 hover:opacity-70 w-fit"
        >
          Change password
        </Link>
      </div>
    </div>
  );
}
