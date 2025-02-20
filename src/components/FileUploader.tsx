'use client';

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CircleArrowDown, RocketIcon } from "lucide-react"
function FileUploader() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        //to do something with the files
        console.log(acceptedFiles)
    }, [])
    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } = useDropzone({ onDrop });
    return (
        <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
            <div {...getRootProps()}
                className={`p-10 border-2 border-dashed mt-10 w-[90%] border-blue-600 text-blue-600 rounded-lg h-96
                flex items-center justify-center ${isFocused || isDragAccept ? "bg-blue-300" : "bg-blue-100"}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col justify-center items-center">
                    {/* drag karte waqt rocekt icon warna arrow down icon */}
                    {isDragActive ? (
                        <>
                        <RocketIcon className="h-20 w-20 animate-ping"/>
                        <p>Drop the files here ...</p>
                        </>
                    ):(
                        <>
                        <CircleArrowDown className="h-20 w-20 animate-pulse"/>
                        <p>Drag & drop some files here, or click to select the files</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader