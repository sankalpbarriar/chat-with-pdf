'use client';

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CheckCircleIcon, CircleArrowDown, HammerIcon, RocketIcon, SaveIcon } from "lucide-react"
import useUpload, { StatusText } from "../../hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "../../hooks/useSubsription";
import { toast } from "@/components/ui/use-toast";
function FileUploader() {
    const { progress, status, fileId, handleUpload } = useUpload();   //custom hook
    const router = useRouter();
    const {isOverFileLimit,filesLoading} = useSubscription();

    //redirect user when fileUpload is completed
    useEffect(() => {
        if (fileId) {
            router.push(`/dashboard/files/${fileId}`);
        }
    }, [fileId, router])
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        //to do something with the files
        const file = acceptedFiles[0]; //gett the first file
        if (file) {
            if(!isOverFileLimit && !filesLoading){
                await handleUpload(file)
            }
            else{
                toast({
                    variant:"destructive",
                    title:"Free Plan file limit Reached",
                    description:
                    "You have reached the limit of files for your account. Please upgrade"
                })
            }
        }
        else {
            //do nothing..
            //toast..
        }

    }, [handleUpload , isOverFileLimit,filesLoading,toast])

    const statusIcons: {
        //@ts-expect-error  : should be of another data type
        [key in StatusText]: JSX.Element;
      } = {
        [StatusText.UPLOADING]: (
          <RocketIcon className="h-20 w-20 text-indigo-600" />
        ),
        [StatusText.UPLOADED]: (
          <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
        ),
        [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
        [StatusText.GENERATING]: (
          <HammerIcon className="h-20 w-20 text-indigo-600 animate-bounce" />
        ),
      };

      
    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
        useDropzone({
            onDrop,
            maxFiles: 1,
            accept: {
                "application/pdf": [".pdf"],
            }
        });

    const uploadInProgress = progress != null && progress >= 0 && progress <= 100
    return (
        <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">

            {/* Loading indicator i.e Upload in progress */}
            {uploadInProgress && (
                <div className="mt-32 flex flex-col justify-center items-center gap-5">
                    <div
                    className={`radial-progress bg-blue-300 text-white border-blue-600 border-4 ${
                        progress === 100  && "hidden"
                    }`}
                    role = 'progressbar'
                    style={{
                        // @ts-expect-error  : should be of another data type
                        "--value":progress,
                        "--size":"12rem",
                        "--thickness":"1.3rem",
                    }}
                    >
                        {progress} %</div>

                    {/* Render status icon */}
                    {
                        // @ts-expect-error  : should be of another data type
                        statusIcons[status!]
                    }
                    {/* @ts-expect-error  : should be of another data type */}
                    <p className="text-blue-600 animate-pulse">{status}</p>
                </div>
            )}


            {!uploadInProgress && (<div {...getRootProps()}
                className={`p-10 border-2 border-dashed mt-10 w-[90%] border-blue-600 text-blue-600 rounded-lg h-96
                flex items-center justify-center ${isFocused || isDragAccept ? "bg-blue-300" : "bg-blue-100"}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col justify-center items-center">
                    {/* drag karte waqt rocekt icon warna arrow down icon */}
                    {isDragActive ? (
                        <>
                            <RocketIcon className="h-20 w-20 animate-ping" />
                            <p>Drop the files here ...</p>
                        </>
                    ) : (
                        <>
                            <CircleArrowDown className="h-20 w-20 animate-pulse" />
                            <p>Drag & drop some files here, or click to select the files</p>
                        </>
                    )}
                </div>
            </div>)}
        </div>
    )
}

export default FileUploader