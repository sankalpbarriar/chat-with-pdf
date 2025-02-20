'use client'
import { PlusCircleIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

function PlaceHolderDocuments() {
    const router = useRouter();
    const handleClick = () =>{
        //check if the user is pro or free if he has passed the free limit send him to the upgrade page
        router.push('/dashboard/upload');
    }
    return (
        <Button  onClick={handleClick} className="flex flex-col items-center w-64 h-80
        rounded-xl bg-gray-200 drop-shadow-md text-gray-400">
            <PlusCircleIcon className="h-16 w-16"/>
            <p> Add a Document</p>
        </Button>
    )
}

export default PlaceHolderDocuments