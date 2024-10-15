'use client'

import React, { useState } from "react"
import axios from "axios"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import Link from "next/link"
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
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 relative flex flex-col antialiased">
      <nav className="relative z-10 w-full bg-gray-900 bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">Smart Data Analyst</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/Dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Home
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  About
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Services
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Contact
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white transition duration-150 ease-in-out"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 mb-6">
            Smart Data Analyst
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto my-4 text-sm md:text-base">
            Welcome to the Smart Data Analyst and Report Generator! Upload your data, analyze trends, and generate actionable insights with tailored interactive reports for smarter business decisions.
          </p>
          <div className="mt-8">
            <FileUpload onChange={handleFileUpload} />
            {uploadStatus && (
              <p className="text-blue-400 mt-4">{uploadStatus}</p>
            )}
          </div>
        </div>
      </div>

      <BackgroundBeams />
    </div>
  )
}