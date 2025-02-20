import PlaceHolderDocuments from "./PlaceHolderDocuments"

function Documents() {
    return (
        <div
            className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
                {/* map through the documents */}

                {/* placeholders */}
                <PlaceHolderDocuments/>
        </div>
    )
}

export default Documents