import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { productImages, productTable } from "@/drizzle/schema";
import {
  formCreateProductSchema,
  type UploadedImage,
} from "@/lib/schemas/product";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const offset = (page - 1) * limit;

    // 1) get products (paging)
    const products = await db
      .select()
      .from(productTable)
      .orderBy(productTable.created_at.desc())
      .limit(limit)
      .offset(offset);

    if (products.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 2) fetch images for these product ids (only done images)
    const productIds = products.map((p) => p.id);

    const images = await db
      .select()
      .from(productImages)
      .where(productImages.product_id.in(productIds))
      .orderBy(productImages.ordering.asc());

    // 3) group images by product_id
    const imagesByProduct: Record<number, typeof images> = {};
    for (const img of images) {
      const pid = img.product_id as number;
      if (!imagesByProduct[pid]) imagesByProduct[pid] = [];
      imagesByProduct[pid].push(img);
    }

    // 4) shape response: product + images array (map url from url field or compose from key)
    const data = products.map((p) => {
      const imgs = imagesByProduct[p.id] ?? [];
      // prefer img.url; if url is null but key exists, compose public url (adjust if you use CloudFront)
      const mapped = imgs.map((i) => ({
        id: i.id,
        key: i.key,
        url:
          i.url ??
          (i.key
            ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${i.key}`
            : null),
        ordering: i.ordering,
        is_primary: i.is_primary,
      }));

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        created_at: p.created_at,
        images: mapped,
      };
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = formCreateProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description, price, currency, images } = parsed.data;

  const done = (images as UploadedImage[]).filter(
    (i) =>
      (i.status ?? "done") === "done" &&
      typeof i.key === "string" &&
      i.key.length > 0
  );

  try {
    const insertedId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(productTable)
        .values({
          name,
          description: description ?? undefined,
          price,
          currency,
        })
        .returning({ id: productTable.id });

      if (!created?.id) throw new Error("create product failed");

      if (done.length) {
        await tx.insert(productImages).values(
          done.map((img) => ({
            product_id: created.id,
            key: img.key ?? "",
            url: img.url ?? undefined,
          }))
        );
      }

      return created.id;
    });

    return NextResponse.json({ id: insertedId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
