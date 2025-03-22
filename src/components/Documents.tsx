import { auth } from "@clerk/nextjs/server"
import PlaceHolderDocuments from "./PlaceHolderDocuments"
import { adminDb } from "../../firebaseAdmin";
import Document from "./Document";

async function Documents() {
    auth.protect();

    const { userId } = await auth();
    if (!userId) {
        throw new Error("user not found");
    }

    const documentSnapShot = await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .get();
    return (
        <div
            className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
            {/* map through the documents */}
            {documentSnapShot.docs.map((doc) => {
                const { name, size, downloadUrl } = doc.data();

                return (
                    <Document
                        key={doc.id}
                        id={doc.id}
                        name={name}
                        size={size}
                        downloadUrl={downloadUrl}
                    />
                );
            })}

            {/* placeholders */}
            <PlaceHolderDocuments />
        </div>
    )
}

export default Documents