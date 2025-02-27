"use client";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { generateEmbeddings } from "../actions/generateEmbeddings";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings, This will take a few seconds...",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();
  const route = useRouter();

  const handleUpload = async (file: File) => {
    if (!user || !file) return;

    const fileIdToUploadTo = uuidv4();
    setStatus(StatusText.UPLOADING);

    try {
      // ✅ Use FormData
      const formData = new FormData();
      formData.append("file", file);

      // ✅ Use Axios to upload
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      if (!response.data.url) throw new Error("Failed to upload file");

      const { url } = response.data;
      setStatus(StatusText.UPLOADED);

      // Extract file reference from URL (e.g., "uploads/filename")
      const filePath = new URL(url).pathname.replace("/blob/", "");

      // Save file metadata to Firestore
      setStatus(StatusText.SAVING);
      await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
        name: file.name,
        size: file.size,
        type: file.type,
        downloadUrl: url,
        ref: filePath,
        createdAt: new Date(),
      });

      setStatus(StatusText.GENERATING);
      await generateEmbeddings(fileIdToUploadTo);
      setFileId(fileIdToUploadTo);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return { progress, status, fileId, handleUpload };
}

export default useUpload;
