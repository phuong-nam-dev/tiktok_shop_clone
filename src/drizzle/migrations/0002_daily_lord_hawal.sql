ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "description" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "url" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "key" varchar(1024) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "alt" varchar(255) DEFAULT null;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "mime" varchar(100) DEFAULT null;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "is_primary" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;