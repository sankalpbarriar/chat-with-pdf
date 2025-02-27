import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

export const indexName = "sankalpbarriar";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  apiKey:process.env.GOOGLE_GENAI_API_KEY,
});


async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("user not found");
  }

  console.log("---fetching the messages from the database---");
  const LIMIT = 6;
  //Get the last 6 messages from the chat history
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    .limit(LIMIT)
    .get();

  //convert the chat in firebase format to an array of humanMessages and AI messages
  const chatHistory = chats.docs.map((doc) =>
    doc.data().role == "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(
    `--- fetched last ${chatHistory.length} messages successfully ---`
  );
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  console.log("---fetching the Download URL from firebase admin..---");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Download URL not found");
  }

  console.log(`---Download URL fetched successfully: ${downloadUrl}---`);
  //downloading the pdf
  const response = await fetch(downloadUrl);
  //Loading the PDF into a PDFDocument object
  const data = await response.blob(); //blob is almost like a pdf

  //Load the PDF document from the specified path
  console.log("---Loading PDF Document... ---");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  //Split the document into chunks
  console.log("---Splitting PDF Document... ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`---Split into ${splitDocs.length} parts...`);

  return splitDocs;
}

async function nameSpaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace specified");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;
  //generate embeedings

  console.log("---Generating Embeddings...---");
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "embedding-001",
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
  });

  //connectiong to pineCone client
  const index = pineconeClient.index(indexName);
  const nameSpaceAlreadyExits = await nameSpaceExists(index, docId);

  if (nameSpaceAlreadyExits) {
    console.log(
      `---Namespace ${docId} already exists use the existing embeddings... ---`
    );

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      //@ts-expect-error  : should be of another data type
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
    //if the namespace does not exist, download the PDF from the Firestore via the stored Download URL & genearte the embeddings
    //and store them in the pinecone vectore store
  } else {
    const splitDocs = await generateDocs(docId);
    console.log(`---Took the splitted docs---`);

    // Generating embeddings
    console.log("---Generating embeddings for split documents...---");
    const vectors = await embeddings.embedDocuments(
      splitDocs.map((doc) => doc.pageContent)
    );

    // Debugging: Log the embeddings shape
    console.log(`✅ Embeddings generated successfully!`);
    console.log(`🔹 Number of vectors: ${vectors.length}`);
    console.log(
      `🔹 First vector dimension: ${vectors.length > 0 ? vectors[0].length : 0}`
    );
    console.log(`🔹 Expected dimension: 768`);

    console.log(
      `---Storing the embeddings in the namespace ${docId} in the ${indexName} Pinecone vector store---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        //@ts-expect-error  : should be of another data type
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }
}
let pineconeVectorStore;
const generateLangchainCompletion = async (docId: string, question: string) => {
  

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error("PineconeVectorStore not found");
  }

  //Create a retreiever to search throigh the vector store
  console.log("----createing a retriever---");
  const retriever = pineconeVectorStore.asRetriever();

  //fetch the chat history from the database
  //work flow -->        input: PDF file in embeddings format , prev messages then it will give the repsonse
  const chatHistory = await fetchMessagesFromDB(docId);

  //definig the prompt template for searching queries based in conversation history
  console.log(" -- Defining the Prompt Template ---");

  //this will generate the prompt
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, //actual chat history

    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  //creating  a history-aware retriever chain that uses the model ,retriever, and prompt
  console.log("--- Creating a history-aware retriever chain.. ---");
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  // Define a prompt template for answering questions based on retrieved context
  console.log("--- Defining a prompt template for answering questions... ---");
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the below context:\n\n{context}",
    ],

    ...chatHistory, // Insert the actual chat history here

    ["user", "{input}"],
  ]);

  //creating a document combining chain the retriever document into a coherent response
  console.log("-- creating a document combining chain---");
  //it takes the prompt
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });

  // Create the main retrieval chain that combines the history-aware retriever and document combining chains
  console.log("--- Creating the main retrieval chain... ---");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("--- Running the chain with a sample conversation... ---");
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  // Print the result to the console
  console.log(reply.answer);
  return reply.answer;
};

export { model, generateLangchainCompletion };
