"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ProductImageUploader from "@/features/product/components/ProductImageUploader";
import {
  CreateProductInput,
  formCreateProductSchema,
} from "@/lib/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

type FormValues = CreateProductInput;

const CreateProductPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formCreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      currency: "VND",
      images: [],
    },
  });

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Create product failed");
        }

        const data = await res.json();

        if (data.id) router.push(`/products/${data.id}`);
      } catch (e) {
        console.error(e);
      }
    });
  }

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-semibold">Thêm sản phẩm</div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh sản phẩm</FormLabel>
                    <FormControl>
                      <ProductImageUploader
                        value={field.value}
                        onChange={(next) => {
                          field.onChange?.(next);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên sản phẩm..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sản phẩm</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả sản phẩm..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 items-end">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Giá sản phẩm</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập giá sản phẩm..."
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="w-[120px]">
                      <FormLabel>Tiền tệ</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="VND" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VND">VND</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full items-end">
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? "Đang tạo..." : "Tạo"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default CreateProductPage;
