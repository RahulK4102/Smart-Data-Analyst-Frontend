"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileUp } from "lucide-react"

export const FileUpload = ({ onChange }: { onChange: (files: File[]) => void }) => {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
      onChange(acceptedFiles)
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`w-full p-4 border-2 border-dashed rounded-md cursor-pointer transition hover:bg-gray-700/50 ${
        isDragActive ? "border-blue-500" : "border-gray-700"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <FileUp className="h-6 w-6 text-gray-500 mb-2" />
        <p className="text-sm text-gray-400">
          {isDragActive ? "Drop the files here..." : `Click or drag to upload (csv, xls, xlsx)`}
        </p>
      </div>
    </div>
  )
}
