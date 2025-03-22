"use server";
import { del } from "@vercel/blob";
import pineconeClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebaseAdmin";
import { indexName } from "@/lib/langchain";
import { revalidatePath } from "next/cache";

// Delete from 3 places: 1. Firestore, 2. Pinecone namespace, 3. Vercel Blob
export async function deleteDocument(docId: string) {
  auth.protect();

  const { userId } = await auth();

  // Retrieve file reference from Firestore
  const docRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(docId);

  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    return { error: "Document not found" };
  }

  const fileRef = docSnapshot.data()?.ref;

  // Delete from Firestore
  await docRef.delete();
  console.log("Deleted from Firestore");
  revalidatePath("/dashboard");

  // Delete from Pinecone namespace
  const index = pineconeClient.index(indexName);
  await index.namespace(docId).deleteAll();

  console.log("Deleted from Pinecone");
  revalidatePath("/dashboard");

  // Delete from Vercel Blob using fileRef
  if (fileRef) {
    try {
      const fileKey = fileRef.startsWith("/") ? fileRef.substring(1) : fileRef;
      await del(fileKey);
      console.log("Deleted from Vercel Blob:", fileKey);
    } catch (error) {
      console.error("Error deleting from Vercel Blob:", error);
    }
  }

  return { message: "File deleted successfully" };
}
