'use client'

import React, { useState } from "react"
import axios from "axios"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function BackgroundBeamsDemo() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const router = useRouter()
  
  const handleFileUpload = async (files: File[]) => {
    setFiles(files)
    console.log(files)

    if (files.length > 0) {
      const formData = new FormData()
      formData.append('file', files[0])

      try {
        setUploadStatus("Uploading...")
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log(response.data)
        setUploadStatus("File uploaded successfully!")
      } catch (error) {
        console.error('Error uploading file:', error)
        setUploadStatus("Error uploading file. Please try again.")
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col antialiased">
      <nav className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-neutral-200 text-xl font-bold">Smart Data Analyst</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/DashBoard" className="text-neutral-300 hover:text-neutral-100 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="#" className="text-neutral-300 hover:text-neutral-100 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="#" className="text-neutral-300 hover:text-neutral-100 px-3 py-2 rounded-md text-sm font-medium">
                  Services
                </Link>
                <Link href="#" className="text-neutral-300 hover:text-neutral-100 px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center text-neutral-300 hover:text-neutral-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Image 
                    src="/logout.svg"
                    alt="Logout"
                    width={24} 
                    height={24}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Smart Data Analyst
          </h1>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Welcome to the Smart Data Analyst and Report Generator! Upload your data, analyze trends, and generate actionable insights with tailored interactive reports for smarter business decisions.
          </p>
          <FileUpload onChange={handleFileUpload} />
          {uploadStatus && (
            <p className="text-neutral-300 text-center mt-4">{uploadStatus}</p>
          )}
        </div>
      </div>

      <BackgroundBeams />
    </div>
  )
}