import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              folder: "portfolio",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            }
          );
          stream.end(buffer);
        });
      })
    );

    return NextResponse.json({ urls: uploadResults });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
