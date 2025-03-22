import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse FormData to get the file
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("Uploading file:", file.name, file.type);

    // Upload to Vercel Blob Storage
    const { url } = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: "public",
      contentType: file.type,
    });

    console.log("Uploaded file URL:", url);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    console.log("Deleting file:", url);

    await del(url);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
