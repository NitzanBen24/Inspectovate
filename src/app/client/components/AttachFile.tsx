"use client";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface Props {
    updateFiles: (files: File[]) => void,
}

const AttachFile = forwardRef(({ updateFiles }: Props, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    // Effect to update the parent component when files change
    useEffect(() => {
        if (files.length) {
            updateFiles(files);
        }
    }, [files, updateFiles]);

    // Expose a clear method to the parent
    useImperativeHandle(ref, () => ({
        clear() {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setFiles([]);
        },
    }));

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList) {
            const newFiles = Array.from(fileList).filter((file) => {
                // Example validation: allow only images under 5MB
                return file.size <= 5 * 1024 * 1024 && file.type.startsWith("image/");
            });
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    // Remove a specific file
    const removeFile = (index: number) => {
        const fileToRemove = files[index];

        // Revoke the object URL to free memory
        URL.revokeObjectURL(URL.createObjectURL(fileToRemove));

        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-start gap-4 py-4">
            {/* File input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="border p-2 rounded"
            />

            {/* Display selected images with remove button */}
            {files.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {files.map((file, index) => {
                        const imageURL = URL.createObjectURL(file);
                        return (
                            <div key={index} className="relative w-20 h-20 overflow-hidden rounded-lg">
                                <img
                                    src={imageURL}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                                >
                                    x
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

AttachFile.displayName = "AttachFile"; // Fix for forwardRef

export default AttachFile;

