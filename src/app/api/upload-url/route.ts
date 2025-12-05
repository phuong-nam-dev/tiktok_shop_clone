import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const region = process.env.AWS_REGION!;
const bucket = process.env.S3_BUCKET!;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const files: { name: string; type: string }[] = body.filesMeta || [];

    const results = await Promise.all(
      files.map(async (f, idx) => {
        const ext = (f.name.match(/\.[^/.]+$/) || [""])[0];
        const key = `products/${Date.now()}-${crypto
          .randomBytes(6)
          .toString("hex")}-${idx}${ext}`;

        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: f.type,
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 60 });

        const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

        return {
          key,
          uploadUrl: url,
          publicUrl,
        };
      })
    );

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error creating upload URLs" },
      { status: 500 }
    );
  }
}
