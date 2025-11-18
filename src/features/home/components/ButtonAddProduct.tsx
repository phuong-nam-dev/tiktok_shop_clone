"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { navigationPath } from "@/constants/navigation";

const ButtonAddProduct = () => {
  const router = useRouter();

  return (
    <Button
      className="max-w-[300px] cursor-pointer"
      onClick={() => router.push(navigationPath.CREATE_PRODUCT)}
    >
      Add product
    </Button>
  );
};

export default ButtonAddProduct;
