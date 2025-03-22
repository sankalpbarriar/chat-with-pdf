'use client'
import { FrownIcon, PlusCircleIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import useSubscription from "../../hooks/useSubsription"

function PlaceHolderDocuments() {
    const { isOverFileLimit } = useSubscription()
    const router = useRouter();

    const handleClick = () => {
        //check if the user is pro or free if he has passed the free limit send him to the upgrade page
        if (isOverFileLimit) {
            router.push("/dashboard/upgrade");
        } else {
            router.push("/dashboard/upload");
        }
    }
    return (
        <Button onClick={handleClick}
            className="flex flex-col items-center w-64 h-80
        rounded-xl bg-gray-200 drop-shadow-md text-gray-400">

            {isOverFileLimit ? (
                <FrownIcon style={{ width: "4rem", height: "4rem" }} />
            ) : (
                <PlusCircleIcon style={{ width: "4rem", height: "4rem" }} />
            )}

            <p className="font-semibold">
                {isOverFileLimit ? "Upgrade to add more doucments" : "Add a document"}
            </p>
        </Button>
    )
}

export default PlaceHolderDocuments