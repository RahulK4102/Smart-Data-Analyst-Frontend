"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Menu, LogOut, Send, Bot, User, Loader2, Download, FileDown, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MessageContent = {
  text?: string
  imageUrl?: string
}

type Message = {
  id: string
  content: MessageContent
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotInterfaceProps {
  reportData?: any
}

export default function ChatbotInterface({ reportData }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: {
        text: "Hello! I'm your Smart Data Analyst assistant. Your report has been generated. How can I help you understand the insights?",
      },
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add initial report summary message if reportData exists
  useEffect(() => {
    if (reportData) {
      // Add a message with report summary
      const reportSummaryMessage: Message = {
        id: Date.now().toString(),
        content: {
          text: "I've analyzed your data and generated a comprehensive report. Here's a summary of the key findings:",
        },
        sender: "bot",
        timestamp: new Date(),
      }

      // Add visualization message if available
      const visualizationMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: {
          imageUrl: "/placeholder.svg?height=400&width=600",
          text: "This visualization represents the main trends in your data.",
        },
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, reportSummaryMessage, visualizationMessage])
    }
  }, [reportData])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: {
        text: inputMessage,
      },
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      // Example response with text
      const botTextMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: {
          text: "I've analyzed your request and here's what I found. Below is a visualization of the data trends:",
        },
        sender: "bot",
        timestamp: new Date(),
      }

      // Example response with an image
      const botImageMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: {
          imageUrl: "/placeholder.svg?height=400&width=600",
          text: "This chart shows the monthly revenue trends based on your data.",
        },
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botTextMessage, botImageMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Function to download chat as PDF
  const downloadAsPDF = async () => {
    try {
      setIsExporting(true)

      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import("jspdf")
      const { default: html2canvas } = await import("html2canvas")

      if (!chatContainerRef.current) {
        throw new Error("Chat container not found")
      }

      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add title
      doc.setFontSize(20)
      doc.setTextColor(0, 0, 255)
      doc.text("Smart Data Analyst - Chat Export", 20, 20)

      // Add date
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated on: ${formatDate(new Date())}`, 20, 30)

      // Add horizontal line
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 35, 190, 35)

      let yPosition = 45

      // Add each message to the PDF
      for (const message of messages) {
        // Add sender info
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`${message.sender === "bot" ? "Assistant" : "You"} - ${formatTime(message.timestamp)}`, 20, yPosition)
        yPosition += 7

        // Add message text
        if (message.content.text) {
          doc.setFontSize(12)
          doc.setTextColor(0, 0, 0)

          // Split text into lines to handle wrapping
          const textLines = doc.splitTextToSize(message.content.text, 170)
          doc.text(textLines, 20, yPosition)
          yPosition += 7 * textLines.length
        }

        // Add image if present
        if (message.content.imageUrl) {
          try {
            // For demo purposes, we'll add a placeholder text
            // In a real implementation, you would need to handle image conversion
            doc.setFontSize(10)
            doc.setTextColor(100, 100, 100)
            doc.text("[Image: Data Visualization]", 20, yPosition)
            yPosition += 40 // Space for image
          } catch (error) {
            console.error("Error adding image to PDF:", error)
          }
        }

        yPosition += 10 // Add space between messages

        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
      }

      // Save the PDF
      doc.save("chat-export.pdf")

    } catch (error) {
      console.error("Error generating PDF:", error)
      
    } finally {
      setIsExporting(false)
    }
  }

  // Function to download chat as text
  const downloadAsText = () => {
    try {
      setIsExporting(true)

      let content = "Smart Data Analyst - Chat Export\n"
      content += `Generated on: ${formatDate(new Date())}\n\n`

      // Add each message to the text file
      messages.forEach((message) => {
        content += `${message.sender === "bot" ? "Assistant" : "You"} - ${formatTime(message.timestamp)}\n`
        if (message.content.text) {
          content += `${message.content.text}\n`
        }
        if (message.content.imageUrl) {
          content += `[Image: Data Visualization]\n`
        }
        content += "\n"
      })

      // Create a blob and download link
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "chat-export.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error("Error generating text file:", error)
      
    } finally {
      setIsExporting(false)
    }
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
                <Link
                  href="/Dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Chat
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Analytics
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Reports
                </Link>
                <Button
                  onClick={logout}
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

      <div className="flex-grow flex flex-col max-w-4xl w-full mx-auto px-4 py-6">
        <div className="text-center mb-6 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600">
            Data Analysis Assistant
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 md:mt-0 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                disabled={messages.length <= 1 || isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={downloadAsPDF}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAsText}>
                <FileDown className="h-4 w-4 mr-2" />
                <span>Export as Text</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-grow flex flex-col bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3 max-w-[85%]", message.sender === "user" ? "ml-auto justify-end" : "")}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 border border-gray-700 shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "rounded-lg p-3 text-sm",
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100",
                  )}
                >
                  {message.content.text && <div className="mb-2">{message.content.text}</div>}

                  {message.content.imageUrl && (
                    <div className="relative mt-2 mb-2 rounded-md overflow-hidden">
                      <Image
                        src={message.content.imageUrl || "/placeholder.svg"}
                        alt="Data visualization"
                        width={500}
                        height={300}
                        className="object-contain rounded-md"
                      />
                    </div>
                  )}

                  <div className={cn("text-xs mt-1", message.sender === "user" ? "text-blue-200" : "text-gray-400")}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 border border-gray-700 shrink-0">
                    <AvatarFallback className="bg-gray-700 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 border border-gray-700">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-800 rounded-lg p-3 text-gray-100">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your data analysis report..."
                className="min-h-[50px] bg-gray-800 border-gray-700 text-white resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your data assistant can explain the report, analyze trends, and provide additional insights based on your
              questions.
            </p>
          </div>
        </div>
      </div>

      <BackgroundBeams />
    </div>
  )
}
