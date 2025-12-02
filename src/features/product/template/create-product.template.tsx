"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  type CreateProductInput,
  formCreateProductSchema,
} from "@/lib/schemas/product";
import ProductImageUploader from "../components/ProductImageUploader";
import { createProductService } from "../service/product";
import { navigationPath } from "@/constants/navigation";

type FormValues = CreateProductInput;

const CreateProductTemplate = () => {
  const router = useRouter();

  const [submitting, startSubmitting] = useTransition();

  const defaultValues = {
    name: "",
    description: "",
    price: "",
    currency: "VND",
    images: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formCreateProductSchema),
    defaultValues,
  });

  function onSubmit(values: FormValues) {
    startSubmitting(async () => {
      try {
        const data: {
          id: string;
        } = await createProductService(values);

        if (data.id) {
          toast.success("Tạo sản phẩm thành công");
          return router.push(navigationPath.HOME);
        }
      } catch (e: any) {
        console.error(e);
        toast.error(e.message ?? "Có lỗi xảy ra");
      }
    });
  }

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4"
      >
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
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá sản phẩm</FormLabel>
                    <div className="flex gap-2">
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
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="VND" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="VND">VND</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="JPY">JPY</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-end">
                <Button
                  type="submit"
                  className="cursor-pointer min-w-2xs"
                  disabled={submitting}
                >
                  {submitting ? "Đang tạo..." : "Tạo"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </Container>
  );
};

export default CreateProductTemplate;
