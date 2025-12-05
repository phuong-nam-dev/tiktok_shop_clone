import React from "react";

import { db } from "@/drizzle/db";
import { productImages, productTable } from "@/drizzle/schema";
import { ProductImage } from "../types/product";
import Image from "next/image";
import ProductCard from "@/features/home/components/ProductCard";

const ListProduct = async () => {
  const products = await db.select().from(productTable);

  const productIds = products.map((p) => p.id);

  const images = productIds.length ? await db.select().from(productImages) : [];

  const imagesByProduct: Record<number, ProductImage[]> = {};

  for (const img of images) {
    const pid = img.product_id as number;
    if (!imagesByProduct[pid]) imagesByProduct[pid] = [];
    imagesByProduct[pid].push({
      id: img.id,
      key: img.key,
      url: img.url ?? null,
      ordering: img.ordering,
      is_primary: img.is_primary,
    });
  }

  const data = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    price: String(p.price), // numeric may come as string/number depending on driver
    currency: p.currency,
    created_at: String(p.created_at),
    images: imagesByProduct[p.id] ?? [],
  }));

  return (
    <>
      {data.length === 0 ? (
        <div className="size-full flex items-center flex-col gap-4">
          <Image
            src={"/icon/empty_product.png"}
            alt="empty_product"
            width={100}
            height={100}
            className="object-cover"
          />
          <div>Không tìm thấy sản phẩm nào !</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
};

export default ListProduct;
