"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { formatCurrency } from "@/lib/schemas/format";

type ProductImage = {
  id: number;
  url?: string | null;
};

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  currency: string;
  images: ProductImage[];
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const img =
    product.images.find((i) => (i as any).is_primary) ?? product.images[0];
  const src = img?.url ?? "/icon/empty_product.png";
  const [error, setError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
    >
      {/* Image */}
      <div className="w-full h-44 bg-slate-100 relative overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7l9 6 9-6"
              />
            </svg>
            <span className="text-xs">Không có ảnh</span>
          </div>
        ) : (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTVlNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==" // light blur
            onError={() => setError(true)}
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-medium leading-tight truncate">
              {product.name}
            </div>
            <div className="text-xs text-slate-500 line-clamp-2 mt-1">
              {product.description}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-semibold">
            {formatCurrency(product.price, product.currency)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
