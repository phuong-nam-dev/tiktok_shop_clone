import { Suspense, type ReactNode } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import ButtonAddProduct from "@/features/home/components/ButtonAddProduct";
import ListProduct from "@/features/product/components/ListProduct";

interface CategoryItemProps {
  icon: ReactNode;
  text: string;
}

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

export default function Home() {
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
            <Suspense>
              <ListProduct />
            </Suspense>
          </div>
        </div>
      </div>
    </Container>
  );
}
