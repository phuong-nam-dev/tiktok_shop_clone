"use client";

import { Trash2, UploadCloud, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UploadedImage } from "@/lib/schemas/product";
import { cn } from "@/lib/utils";
import {
  createSignedUrlForProductService,
  FileMeta,
  uploadFileWithProgress,
} from "../service/product";

interface ProductImageUploaderProps {
  value?: UploadedImage[];
  maxFiles?: number;
  onChange?: (images: UploadedImage[]) => void;
}

export default function ProductImageUploader({
  value = [],
  maxFiles = 6,
  onChange,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>(value);
  const objectUrlMapRef = useRef<Record<string, string>>({});

  const setLocalImages = (
    next: UploadedImage[] | ((prev: UploadedImage[]) => UploadedImage[])
  ) => {
    setImages(next as any);
  };

  const makeId = (file: File) => `${file.name}-${file.size}-${Date.now()}`;

  const handleFiles = async (files: FileList | null) => {
    setError(null);
    if (!files) return;

    const incoming = Array.from(files);
    if (images.length + incoming.length > maxFiles) {
      setError(`Chỉ được upload tối đa ${maxFiles} ảnh`);
      return;
    }

    const allowed = incoming.filter((f) => f.type.startsWith("image/"));
    if (allowed.length !== incoming.length) {
      setError("Chỉ chấp nhận file ảnh (jpg, png, webp, ...)");
    }

    const newEntries: UploadedImage[] = allowed.map((f) => {
      const id = makeId(f);
      const preview = URL.createObjectURL(f);
      objectUrlMapRef.current[id] = preview;
      return {
        id,
        fileName: f.name,
        status: "uploading",
        progress: 0,
        errorMessage: undefined,
        // Use url as preview until upload returns public url
        url: preview,
      } as UploadedImage;
    });

    // only update local images here; onChange will be emitted by useEffect
    setLocalImages((prev) => [...prev, ...newEntries]);

    try {
      const filesMeta: FileMeta[] = allowed.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      }));

      const response = await createSignedUrlForProductService({
        filesMeta,
      });

      const data = await response.json();

      const { results } = data;

      if (!Array.isArray(results) || results.length !== allowed.length) {
        throw new Error("Upload URL mismatch");
      }

      await Promise.all(
        results.map(async (r: any, idx: number) => {
          const file = allowed[idx];
          const entryId = newEntries[idx].id;

          try {
            await uploadFileWithProgress(r.uploadUrl, file, (percent) => {
              setLocalImages((prev) =>
                prev.map((it) =>
                  it.id === entryId ? { ...it, progress: percent } : it
                )
              );
            });

            // Update the entry to done. IMPORTANT: do NOT call onChange here.
            setLocalImages((prev) =>
              prev.map((it) =>
                it.id === entryId
                  ? {
                      ...it,
                      status: "done",
                      progress: 100,
                      url: r.publicUrl,
                      key: r.key,
                      file: undefined,
                    }
                  : it
              )
            );
          } catch (err: any) {
            console.error("Upload failed for", file.name, err);
            setLocalImages((prev) =>
              prev.map((it) =>
                it.id === entryId
                  ? {
                      ...it,
                      status: "error",
                      errorMessage: err?.message || "Upload failed",
                    }
                  : it
              )
            );
          }
        })
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Lỗi khi upload");
      setLocalImages((prev) =>
        prev.map((it) =>
          newEntries.some((n) => n.id === it.id)
            ? { ...it, status: "error", errorMessage: "Lỗi khi lấy URL upload" }
            : it
        )
      );
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.currentTarget.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (img: UploadedImage) => {
    if (img.id) {
      const preview = objectUrlMapRef.current[img.id];
      if (preview) {
        URL.revokeObjectURL(preview);
        delete objectUrlMapRef.current[img.id];
      }
    }

    setLocalImages((prev) => prev.filter((it) => it.id !== img.id));
  };

  useEffect(() => {
    onChange?.(images);
  }, [images]);

  useEffect(() => {
    return () => {
      Object.values(objectUrlMapRef.current).forEach((u) =>
        URL.revokeObjectURL(u)
      );
      objectUrlMapRef.current = {};
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload hình ảnh sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-dashed border-2 rounded-lg p-6 text-center cursor-pointer",
            "border-slate-200 hover:border-slate-300"
          )}
          role="button"
        >
          <div className="flex items-center justify-center gap-3">
            <UploadCloud className="h-6 w-6" />
            <div>
              <div className="font-medium">
                Kéo thả ảnh ở đây hoặc nhấn để chọn
              </div>
              <div className="text-sm text-slate-500">
                Tối đa {maxFiles} ảnh. JPG, PNG, WEBP
              </div>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onInputChange}
          />
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <div className="mt-4 flex gap-3">
          {images.map((p) => (
            <div
              key={p.id}
              className="relative rounded-md overflow-hidden border max-w-[145px]"
            >
              <img
                src={p.url}
                alt="preview"
                className="object-cover w-full h-28"
              />

              {p.status === "uploading" && (
                <div className="absolute left-1 bottom-1 right-1 bg-white/80 rounded-md p-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div>Đang upload...</div>
                    <div>{p.progress ?? 0}%</div>
                  </div>
                  <div className="h-1 bg-slate-200 rounded mt-1">
                    <div
                      style={{ width: `${p.progress ?? 0}%` }}
                      className="h-full bg-blue-500 rounded"
                    />
                  </div>
                </div>
              )}

              {p.status === "error" && (
                <div className="absolute left-1 bottom-1 right-1 bg-red-100 rounded-md p-1 text-xs text-red-700">
                  {p.errorMessage ?? "Upload lỗi"}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(p);
                }}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {images.length < maxFiles && (
            <div
              className="flex items-center justify-center rounded-md border border-dashed h-28 max-w-[145px] w-full"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <div className="text-sm text-slate-500">Thêm ảnh</div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {images.length} / {maxFiles} ảnh
        </div>
        <Button
          variant="ghost"
          type="button"
          onClick={() => setLocalImages([])}
          disabled={images.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Xóa tất cả
        </Button>
      </CardFooter>
    </Card>
  );
}
