import type { CreateProductInput } from "@/lib/schemas/product";

export const createProductService = async (data: CreateProductInput) => {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "Create product failed");
  }

  return response.json();
};
