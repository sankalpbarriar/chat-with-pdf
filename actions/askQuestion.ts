"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebaseAdmin";
import { Message } from "@/components/Chat";
import { generateLangchainCompletion } from "@/lib/langchain";

// const PRO_LIMIT = 20;
// const FREE_LIMIT = 2;

//fetching limits dynamically
async function getPlanLimits() {
  const limitsRef = adminDb.collection("limits").doc("planLimits");
  const docSnap = await limitsRef.get();

  if (!docSnap.exists) {
    console.error("Plan limits document not found in Firestore.");
    return { free: 2, pro: 20 }; // Default values as a fallback
  }

  const data = docSnap.data();
  return {
    free: data?.free ?? 2, 
    pro: data?.pro ?? 20,
  };
}
//embeddings --> pass it to the langchain --> quesry processing --> AI response
export async function askQuestion(id: string, question: string) {
  auth.protect();
  const { userId } = await auth();
  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  const { free: FREE_LIMIT, pro: PRO_LIMIT } = await getPlanLimits();

  const userRef = await adminDb.collection("users").doc(userId!).get();

  console.log("DEBUG 2", userRef.data());

  //check if user is on FREE plan and has asked more than 3 questions
  if (!userRef.data()?.hasActiveMembership) {
    console.log("DBUG 3", userMessages.length, FREE_LIMIT);
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions! 😢`,
      };
    }
  }

  //if user is om PRO plan and asked more than 100 qustions
  if (userRef.data()?.hasActiveMembership) {
    console.log("DBUG 4", userMessages.length, PRO_LIMIT);
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        message: `You've reacehd the PRO limit of ${PRO_LIMIT} qustions per doc 😢`,
      };
    }
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  //generate AI response

  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };
  await chatRef.add(aiMessage);

  return { success: true, message: null }; //the realtime listner in frontend
}
