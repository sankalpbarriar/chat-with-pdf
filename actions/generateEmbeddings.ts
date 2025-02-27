'use server'

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId : string ){
    //only authenticated users can access this function otherwise clerk will throw them to the sigIn page
    auth.protect(); 

    //turn a PDF into embeddings [0.123424,0.24334351, ...]
    await generateEmbeddingsInPineconeVectorStore(docId);

    revalidatePath('/dashboard')  //whatever we have fetched we want to make sure it is refetched

    return {completed:true};
} 