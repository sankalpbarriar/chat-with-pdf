//Right View
'use client'

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css"
import { Document, Page, pdfjs } from "react-pdf"
import { useState, useEffect } from "react";
import { Loader2Icon, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
function PDFView({ url }: { url: string }) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [file, setFile] = useState<Blob | null>(null);
    const [rotation, setRotation] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(url);
            const file = await response.blob();

            setFile(file);
        };

        fetchFile();
    }, [url]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        setNumPages(numPages);
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="sticky top-0 z-50 bg-gray-100 p-2 rounded-b-lg">
                <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
                    <Button
                        variant="outline"
                        disabled={pageNumber === 1}
                        onClick={() => {
                            if (pageNumber > 1) {
                                setPageNumber(pageNumber - 1);
                            }
                        }}
                    >
                        Previous
                    </Button>

                    <Button>
                        <p className="flex items-center justify-center">
                            {pageNumber} of {numPages}
                        </p>
                    </Button>

                    <Button
                        variant="outline"
                        disabled={pageNumber === numPages}
                        onClick={() => {
                            if (numPages) {
                                if (pageNumber < numPages) {
                                    setPageNumber(pageNumber + 1);
                                }
                            }
                        }}
                    >
                        Next
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setRotation((rotation + 90) % 360)}
                    >
                     <RotateCcw/>
                    </Button>

                    <Button
                    disabled = {scale >= 1.5}
                    onClick={()=>{
                        setScale(scale * 1.2)
                    }}
                    >
                        <ZoomIn/>
                    </Button>

                    <Button
                    disabled = {scale <= 0.75}
                    onClick={()=>{
                        setScale(scale / 1.2)
                    }}
                    >
                        <ZoomOut/>
                    </Button>
                </div>
            </div>
            {!file ? (
                <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
            ) : (
                <Document
                    loading={null}
                    file={file}
                    rotate={rotation}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="m-4 overflow-scroll"
                >
                    <Page className="shadow-lg" scale={scale} pageNumber={pageNumber} />
                </Document>
            )}

        </div>
    )
}

export default PDFView