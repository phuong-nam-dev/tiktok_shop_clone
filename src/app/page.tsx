import Image from "next/image";
import type { ReactNode } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { db } from "@/drizzle/db";
import { productImages, productTable } from "@/drizzle/schema";
import ButtonAddProduct from "@/features/home/components/ButtonAddProduct";
import ProductCard from "@/features/home/components/ProductCard";

interface CategoryItemProps {
  icon: ReactNode;
  text: string;
}

type ProductImage = {
  id: number;
  key?: string | null;
  url?: string | null;
  ordering?: number | null;
  is_primary?: boolean | null;
};

export const CategoryItem = (props: CategoryItemProps) => {
  const { icon, text } = props;

  return (
    <div className="max-w-20 flex-col flex gap-1 items-center group cursor-pointer">
      <div className="group-hover:text-blue-600">{icon}</div>
      <div className="text-sm font-medium group-hover:text-blue-600">
        {text}
      </div>
    </div>
  );
};

export default async function Home() {
  "use cache";

  const products = await db.select().from(productTable);

  const productIds = products.map((p) => p.id);
  const images = productIds.length ? await db.select().from(productImages) : [];

  // group images
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

  // map to DTO
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
    <Container>
      <div className="size-full flex flex-col gap-4">
        <ButtonAddProduct />
        <Input placeholder="Tìm sản phẩm..." className="h-10" />
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-semibold">Categories</div>
          <div className="flex gap-10 size-full">
            <div className="flex gap-2 flex-col size-full max-w-[300px]">
              <div className="rounded-md px-4 py-2 text-white text-sm bg-black cursor-pointer">
                All
              </div>
              <div className="rounded-md border px-4 py-2 text-sm cursor-pointer">
                Đồ gia dụng
              </div>
              <div className="rounded-md border px-4 py-2 text-sm cursor-pointer">
                Quần áo nam
              </div>
              <div className="rounded-md border px-4 py-2 text-sm cursor-pointer">
                Chăm sóc cá nhân
              </div>
              <div className="rounded-md border px-4 py-2 text-sm cursor-pointer">
                Phụ kiện điện thoại
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </Container>
  );
}
