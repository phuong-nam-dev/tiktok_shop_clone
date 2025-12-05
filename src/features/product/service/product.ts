import { CreateProductInput } from "@/lib/schemas/product";

export type FileMeta = {
  name: string;
  type: string;
  size: number;
};

export type CreateSignedUrlForProductService = {
  filesMeta: FileMeta[];
};

export const createSignedUrlForProductService = async (
  data: CreateSignedUrlForProductService
) => {
  const response = await fetch("/api/upload-url", {
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

export const uploadFileWithProgress = (
  url: string,
  file: File,
  onProgress: (percent: number) => void
) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        const percent = Math.round((ev.loaded / ev.total) * 100);
        onProgress(percent);
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => {
      reject(new Error("aborted"));
    };
    xhr.send(file);
  });
