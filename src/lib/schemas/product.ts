import z from "zod";

export const uploadedImageSchema = z.object({
  id: z.string().optional(),

  fileName: z.string().optional(),

  key: z.string().optional(),

  url: z.string().url().optional(),

  status: z.enum(["uploading", "done", "error"]).optional(),

  progress: z.number().min(0).max(100).optional(),

  errorMessage: z.string().optional(),

  ordering: z.number().optional(),

  alt: z.string().optional(),

  is_primary: z.boolean().optional(),
});

export const formCreateProductSchema = z.object({
  name: z.string().min(1, "Name product must be required."),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Giá sản phẩm là bắt buộc.")
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) > 0,
      "Giá sản phẩm phải lớn hơn 0."
    ),
  currency: z.string().min(1, "Vui lòng chọn loại tiền tệ."),
  images: z
    .array(uploadedImageSchema)
    .min(1, "Cần ít nhất 1 hình ảnh sản phẩm.")
    .refine(
      (arr) =>
        arr.some((i) => (i.status ?? "done") === "done" && (i.url || i.key)),
      {
        message:
          "Cần ít nhất 1 hình ảnh đã upload thành công (có key hoặc url).",
      }
    ),
});

export type UploadedImage = z.infer<typeof uploadedImageSchema>;
export type CreateProductInput = z.infer<typeof formCreateProductSchema>;
