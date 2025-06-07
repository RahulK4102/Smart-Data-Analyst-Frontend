"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, Send, Bot, User, Loader2, Download, FileDown, FileText, CloudFog } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
// import { BackgroundBeams } from "@/components/ui/background-beams"

// Message types for chatbot
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

export default function SmartDataAnalystPage() {
  // Data Analysis States
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [contextReport, setContextReport] = useState<string>("")
  const [extractedInsights, setExtractedInsights] = useState<string>("")
  const [userDescription, setUserDescription] = useState<string>("")
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null)
  const [showContextSection, setShowContextSection] = useState<boolean>(false)
  const [showCleaningOptions, setShowCleaningOptions] = useState<boolean>(false)
  const [showOutlierOptions, setshowOutlierOptions] = useState<boolean>(false)
  const [outliers, setOutliers] = useState<Record<string, any>>({})
  const [cleaningOptions, setCleaningOptions] = useState("")
  const [outlierOptions, setOutlierOptions] = useState("")
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [expectedColumns, setExpectedColumns] = useState<string[]>([])
  const [columnMappingState, setColumnMappingState] = useState<{ [key: string]: string }>({})

  // Flow control states
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [typingText, setTypingText] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<string>("upload")
  const [showOutlierButton, setShowOutlierButton] = useState<boolean>(false)
  const [showColumnMapping, setShowColumnMapping] = useState<boolean>(false)
  const [showReportButton, setShowReportButton] = useState<boolean>(false)
  const [showChatbot, setShowChatbot] = useState<boolean>(false)
  const [reportData, setReportData] = useState<any>(null)

  // Chatbot states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: {
        text: "Hello! Im your Smart Data Analyst assistant. Your report has been generated. How can I help you understand the insights?",
      },
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "2",
      content: {
        text: "Here are few query you can ask from chatbot.",
      },
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "3",
      content: {
        text: "Can you plot a pie chart for Placement Status?",
      },
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "4",
      content: {
        text: "Can you plot a clear bar graph of how many students got how many cgpa?",
      },
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "5",
      content: {
        text: "Can you plot a heat map of correlation matrix of only numerical columns?",
      },
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Refs
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messageIndexRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    
  }, [])
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")

  // Message sets for different operations
  const typingMessages = {
    upload: [
      "Uploading your file...",
      "Processing data...",
      "Analyzing file structure...",
      "Preparing for analysis...",
    ],
    context: [
      "Detecting context from your description...",
      "Analyzing your requirements...",
      "Extracting business insights...",
      "Processing context information...",
      "Interpreting your data needs...",
    ],
    outliers: [
      "Detecting outliers in your data...",
      "Analyzing data distribution...",
      "Identifying anomalies...",
      "Calculating statistical boundaries...",
      "Processing data points...",
    ],
    cleaning: [
      "Cleaning your data...",
      "Removing inconsistencies...",
      "Applying cleaning operations...",
      "Optimizing dataset quality...",
      "Processing data transformations...",
    ],
    mapping: [
      "Mapping columns...",
      "Analyzing column structures...",
      "Identifying column relationships...",
      "Processing schema information...",
      "Preparing column mappings...",
    ],
    performMapping: [
      "Performing column mapping...",
      "Applying your mapping selections...",
      "Transforming data structure...",
      "Finalizing column relationships...",
      "Processing mapping operations...",
    ],
    report: [
      "Generating comprehensive report...",
      "Analyzing insights...",
      "Creating visualizations...",
      "Compiling statistics...",
      "Formatting report data...",
      "Preparing final document...",
    ],
  }

  // Start typing effect with cycling messages
  const startTypingEffect = (operationType: keyof typeof typingMessages) => {
    setIsProcessing(true)
    messageIndexRef.current = 0

    // Clear any existing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
    }

    // Set initial message
    setTypingText(typingMessages[operationType][0])

    // Start cycling through messages
    typingIntervalRef.current = setInterval(() => {
      messageIndexRef.current = (messageIndexRef.current + 1) % typingMessages[operationType].length
      setTypingText(typingMessages[operationType][messageIndexRef.current])
    }, 2000) // Change message every 2 seconds
  }

  // Stop typing effect
  const stopTypingEffect = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
    setIsProcessing(false)
  }

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
    }
  }, [])

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add initial report summary message if reportData exists
  // useEffect(() => {
  //   if (reportData && showChatbot) {
  //     // Add a message with report summary
  //     const reportSummaryMessage: Message = {
  //       id: Date.now().toString(),
  //       content: {
  //         text: "I've analyzed your data and generated a comprehensive report. Here's a summary of the key findings:",
  //       },
  //       sender: "bot",
  //       timestamp: new Date(),
  //     }

  //     // Add visualization message if available
  //     const visualizationMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       content: {
  //         imageUrl: "/placeholder.svg?height=400&width=600",
  //         text: "This visualization represents the main trends in your data.",
  //       },
  //       sender: "bot",
  //       timestamp: new Date(),
  //     }

  //     setMessages((prev) => [...prev, reportSummaryMessage, visualizationMessage])
  //   }
  // }, [reportData, showChatbot])

  const handleFileUpload = async (files: File[]) => {
    if (!userId) {
      setUploadStatus("User ID is missing. Unable to upload file.")
      return
    }

    if (files.length > 0) {
      const formData = new FormData()
      formData.append("file", files[0])
      formData.append("user_id", userId)

      try {
        startTypingEffect("upload")

        const response = await axios.post("/api/process_dataset", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        console.log(response)
        stopTypingEffect()
        setUploadStatus("File uploaded successfully! Enter description to proceed.")
        setUploadedFileId(response.data.file_id)
        setShowContextSection(true)
        setCurrentStep("description")
      } catch (error) {
        console.error("Error uploading file:", error)
        stopTypingEffect()
        setUploadStatus("Error uploading file. Please try again.")
      }
    }
  }

  const detectOutliers = async () => {
    if (!userId) {
      setUploadStatus("User ID is missing. Cannot detect outliers.")
      return
    }

    try {
      startTypingEffect("outliers")
      // setShowOutlierButton(false)

      const outlierResponse = await axios.post(
        "/api/detect_outliers",
        {
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      console.log(outlierResponse)

      stopTypingEffect()
      setOutliers(outlierResponse.data.outliers || {})
      setUploadStatus("Outlier detection completed!")
      setCurrentStep("cleaning")
      // setShowCleaningOptions(true)
      setshowOutlierOptions(true)
    } catch (error) {
      console.error("Error detecting Outliers:", error)
      stopTypingEffect()
      setUploadStatus("Error detecting Outliers. Please try again.")
      // setShowOutlierButton(true)
    }
  }

  const removeOutlier = async () => {
    if (!userId) {
      setUploadStatus("User ID is missing. Cannot detect outliers.")
      return
    }

    try {
      startTypingEffect("outliers")
      // setShowOutlierButton(false)

      const outlierResponse = await axios.post(
        "/api/remove_outlier",
        {
          user_id: userId,
          outlierOptions: outlierOptions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      console.log(outlierResponse)

      stopTypingEffect()
      setOutliers(outlierResponse.data.outliers || {})
      setUploadStatus("Outlier Removal completed!")
      setCurrentStep("cleaning")
      setShowCleaningOptions(true)
      // setshowOutlierOptions(true)
    } catch (error) {
      console.error("Error detecting Outliers:", error)
      stopTypingEffect()
      setUploadStatus("Error detecting Outliers. Please try again.")
      setShowOutlierButton(true)
    }
  }

  const handleOutlierOption = (value: string) => {
    setOutlierOptions(value)
  }

  const detectContext = async () => {
    if (!userDescription.trim()) {
      setUploadStatus("Please enter a description before detecting context.")
      return
    }

    try {
      startTypingEffect("context")
      setCurrentStep("processing")

      const response = await axios.post(
        "/api/extract_insight",
        {
          user_description: userDescription,
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      console.log(response.data)
      stopTypingEffect()
      setContextReport(response.data.context_report)
      setExtractedInsights(response.data.business_insight)
      setUploadStatus("Context detected successfully!")
      setCurrentStep("insights")
      setShowOutlierButton(true)
    } catch (error) {
      console.error("Error detecting context:", error)
      stopTypingEffect()
      setUploadStatus("Error detecting context. Please try again.")
      setCurrentStep("description")
    }
  }

  const handleCleaningOptionChange = (value: string) => {
    setCleaningOptions(value)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const cleanData = async () => {
    if (!userId) {
      setUploadStatus("User ID is missing. Cannot clean data.")
      return
    }

    try {
      startTypingEffect("cleaning")

      const cleaningDataResponse = await axios.post(
        "/api/clean_data",
        {
          user_id: userId,
          choice: cleaningOptions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      console.log(cleaningDataResponse)

      stopTypingEffect()
      setUploadStatus("Data Cleaning completed!")
    } catch (error) {
      console.error("Error Cleaning data:", error)
      stopTypingEffect()
      setUploadStatus("Error Cleaning data. Please try again.")
    }
  }

  const columnMapping = async () => {
    if (!userId) {
      setUploadStatus("User ID is missing. Cannot perform Column Mapping.")
      return
    }

    try {
      startTypingEffect("mapping")

      const columnMappingResponse = await axios.post(
        "/api/column_mapping",
        {
          user_id: userId,
          context: extractedInsights,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      console.log("columns:", columnMappingResponse)
      stopTypingEffect()
      setAvailableColumns(columnMappingResponse.data.available_columns)
      setExpectedColumns(columnMappingResponse.data.expected_columns)
      setUploadStatus("Column mapping completed!")
      setCurrentStep("mapping")
      setShowColumnMapping(true)
    } catch (error) {
      console.error("Error mapping columns:", error)
      stopTypingEffect()
      setUploadStatus("Error mapping columns. Please try again.")
    }
  }

  const performMapping = async () => {
    if (!userId) {
      setUploadStatus("User ID is missing. Cannot perform Column Mapping.")
      return
    }

    try {
      startTypingEffect("performMapping")

      const response = await axios.post("/api/perform_mapping", {
        mapping: columnMappingState,
      })

      console.log("Mapping submitted:", response.data)
      stopTypingEffect()
      setUploadStatus("Mapping completed successfully!")
      setShowReportButton(true)
      setCurrentStep("report")
    } catch (err) {
      console.error("Error submitting mapping:", err)
      stopTypingEffect()
      setUploadStatus("Error submitting mapping. Please try again.")
    }
  }

  const generateReport = async () => {
    if (!userId) {
      setUploadStatus("User ID is missing. Cannot generate report.")
      return
    }

    try {
      startTypingEffect("report")

      const response = await axios.post("/api/report_gen", {
        column_mapping: columnMappingState,
        business_context: extractedInsights,
        user_id: userId,
      })

      console.log("Report Generated:", response.data)
      stopTypingEffect()
      setUploadStatus("Report generated successfully!")
      setCurrentStep("complete")
      setReportData(response.data)
      setShowChatbot(true) // Show chatbot after report generation
    } catch (err) {
      console.error("Error generating report:", err)
      stopTypingEffect()
      setUploadStatus("Error generating report. Please try again.")
    }
  }

  // Chatbot functions
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      content: {
        text: inputMessage,
      },
      sender: "user",
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
  
    try {
      const ChatBotResponse = await axios.post(
        "/api/chat_bot",
        {
          user_id: userId,
          query: inputMessage,
          context: extractedInsights,
          column_mapping:columnMappingState
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const { message, image } = ChatBotResponse.data;
      console.log(ChatBotResponse.data)
      console.log(ChatBotResponse.data.image)
      const botTextMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: {
          text: message || "Heres the result of your query:",
        },
        sender: "bot",
        timestamp: new Date(),
      };
  
      const botImageMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: {
          imageUrl: `data:image/png;base64,${image}`,
          text: "This is the visualization generated based on your input.",
        },
        sender: "bot",
        timestamp: new Date(),
      };
      console.log("chat response image"+botImageMessage.content.imageUrl)
      setMessages((prev) => [...prev, botTextMessage, botImageMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        content: {
          text: "Oops! Something went wrong while processing your request.",
        },
        sender: "bot",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
      setIsExporting(true);
  
      const { default: jsPDF } = await import("jspdf");
  
      if (!chatContainerRef.current) {
        throw new Error("Chat container not found");
      }
  
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 255);
      doc.text("Smart Data Analyst - Chat Export", 20, 20);
  
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${formatDate(new Date())}`, 20, 30);
  
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);
  
      let yPosition = 45;
  
      for (const message of messages) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `${message.sender === "bot" ? "Assistant" : "You"} - ${formatTime(message.timestamp)}`,
          20,
          yPosition
        );
        yPosition += 7;
  
        if (message.content.text) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          const textLines = doc.splitTextToSize(message.content.text, 170);
          doc.text(textLines, 20, yPosition);
          yPosition += 7 * textLines.length;
        }
  
        if (message.content.imageUrl) {
          try {
            const imgData = await getBase64ImageFromUrl(message.content.imageUrl);
            const imgProps = doc.getImageProperties(imgData);
  
            const imgWidth = 160;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
            // Add image
            if (yPosition + imgHeight > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          } catch (error) {
            console.error("Failed to load image:", error);
          }
        }
  
        yPosition += 10;
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      }
  
      doc.save("chat-export.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Utility to fetch base64 version of image
  const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  

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
                <Link href="/Dashboard" className="text-gray-300 hover:text-white">
                  Home
                </Link>
                <Link href="/#about" className="text-gray-300 hover:text-white">
                  About
                </Link>
                <Link href="/#features" className="text-gray-300 hover:text-white">
                  Services
                </Link>
                <Link href="/#contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <LogOut className="h-5 w-5" />
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

      <div className="flex flex-col lg:flex-row w-full gap-6 p-4">
        {/* Data Analysis Section */}
        <div className={`flex-grow flex flex-col ${showChatbot ? "lg:w-1/2" : "w-full"} mb-8`}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 mb-6">
              Smart Data Analyst
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto my-4">
              Upload your data, enter a description, analyze context, and clean your dataset.
            </p>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-blue-500 shadow-lg animate-pulse">
                <p className="text-blue-400 text-xl font-medium">{typingText}</p>
              </div>
            )}

            {/* File Upload - Only show when not processing and in upload step */}
            {!isProcessing && currentStep === "upload" && (
              <div className="mt-8">
                <FileUpload onChange={handleFileUpload} />
                {uploadStatus && <p className="text-blue-400 mt-4">{uploadStatus}</p>}
              </div>
            )}

            {/* Description Input - Only show when not processing and in description step */}
            {!isProcessing && currentStep === "description" && showContextSection && (
              <div className="mt-6 text-left">
                <label htmlFor="user-description" className="block text-sm font-medium text-gray-300">
                  Enter Description for Context Detection:
                </label>
                <textarea
                  id="user-description"
                  rows={3}
                  className="mt-1 block w-full p-2 rounded-md bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  value={userDescription}
                  onChange={(e) => setUserDescription(e.target.value)}
                />
                <Button onClick={detectContext} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                  Detect Context
                </Button>
              </div>
            )}

            {/* Extracted Insights - Only show when not processing and past the insights step */}
            {!isProcessing &&
              currentStep !== "upload" &&
              currentStep !== "description" &&
              currentStep !== "processing" &&
              extractedInsights && (
                <div className="mt-4 text-left">
                  <h3 className="text-lg font-semibold text-white">Extracted Insights:</h3>
                  <pre className="text-gray-200 whitespace-pre-wrap bg-gray-800 p-4 rounded-lg">
                    {extractedInsights}
                  </pre>
                </div>
              )}

            {/* Detect Outliers Button - Only show when not processing and showOutlierButton is true */}
            {!isProcessing && showOutlierButton && (
              <div className="mt-4 text-left">
                <Button onClick={detectOutliers} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                  Detect Outliers
                </Button>
              </div>
            )}

            {/* Outlier Summary - Only show when not processing and in cleaning step or beyond */}
            {!isProcessing &&
              (currentStep === "cleaning" ||
                currentStep === "mapping" ||
                currentStep === "report" ||
                currentStep === "complete") &&
              Object.keys(outliers).length > 0 && (
                <div className="mt-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Outlier Summary</h3>
                  {Object.entries(outliers).map(([column, stats]) => (
                    <div key={column} className="bg-gray-800 p-4 rounded-lg mb-4">
                      <h4 className="text-blue-400 text-md font-bold mb-2">{column}</h4>
                      <ul className="text-gray-300 text-sm">
                        <li>
                          <strong>Count:</strong> {stats.count}
                        </li>
                        <li>
                          <strong>Max:</strong> {stats.max}
                        </li>
                        <li>
                          <strong>Mean:</strong> {stats.mean}
                        </li>
                        <li>
                          <strong>Median:</strong> {stats.median}
                        </li>
                        <li>
                          <strong>Min:</strong> {stats.min}
                        </li>
                      </ul>
                      {stats.plot && (
                        <img
                          src={`data:image/png;base64,${stats.plot}`}
                          alt={`Boxplot for ${column}`}
                          className="mt-4 rounded border border-gray-600"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

            {!isProcessing && showOutlierOptions && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-1">Select Outlier handle Option:</label>
                <select
                  onChange={(e) => handleOutlierOption(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-700 text-white"
                >
                  <option value="">-- Select an option --</option>
                  <option value="Remove_outliers">1) Remove outliers</option>
                  <option value="Replace_with_mean">2) Replace with mean</option>
                  <option value="Replace_with_median">3) Replace with median</option>
                  <option value="Leave_as_is">4) Leave as is</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <Button onClick={removeOutlier} className="bg-green-500 hover:bg-green-600 text-white">
                    Remove Outlier
                  </Button>
                </div>
              </div>
            )}

            {/* Cleaning Options - Only show when not processing and showCleaningOptions is true */}
            {!isProcessing && showCleaningOptions && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-1">Select Cleaning Option:</label>
                <select
                  onChange={(e) => handleCleaningOptionChange(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-700 text-white"
                >
                  <option value="">-- Select an option --</option>
                  <option value="drop_column">1) Drop Column</option>
                  <option value="drop_nulls">2) Drop Rows with Nulls</option>
                  <option value="fill_na">3) Fill with  (for object)</option>
                  <option value="fill_mean">4) Fill with Mean</option>
                  <option value="fill_median">5) Fill with Median</option>
                  <option value="fill_mode">6) Fill with Most Common Value</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <Button onClick={cleanData} className="bg-green-500 hover:bg-green-600 text-white">
                    Clean Data
                  </Button>
                  <Button onClick={columnMapping} className="bg-green-500 hover:bg-green-600 text-white">
                    Map Column
                  </Button>
                </div>
              </div>
            )}

            {/* Column Mapping - Only show when not processing and showColumnMapping is true */}
            {!isProcessing && showColumnMapping && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Column Mapping</h3>
                {/* Grid of column selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableColumns.map((col) => (
                    <div key={col} className="flex flex-col">
                      <label className="mb-1 font-medium text-white">{col}</label>
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                        value={columnMappingState[col] || col}
                        onChange={(e) => {
                          const selectedValue = e.target.value
                          setColumnMappingState((prev) => {
                            const newMapping = { ...prev }
                            newMapping[col] = selectedValue || col
                            availableColumns.forEach((column) => {
                              if (!newMapping[column]) {
                                newMapping[column] = column
                              }
                            })
                            return newMapping
                          })
                        }}
                      >
                        <option value="">-- Select mapping --</option>
                        {expectedColumns.map((expectedCol) => (
                          <option key={expectedCol} value={expectedCol}>
                            {expectedCol}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Button aligned to the right on a new line */}
                <div className="mt-6 flex justify-end">
                  <Button onClick={performMapping} className="bg-green-500 hover:bg-green-600 text-white">
                    Perform Mapping
                  </Button>
                </div>
              </div>
            )}

            {/* Generate Report Button - Only show when not processing and showReportButton is true */}
            {!isProcessing && showReportButton && (
              <div className="mt-6 flex justify-end">
                <Button onClick={generateReport} className="bg-green-500 hover:bg-green-600 text-white">
                  Generate Report
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Chatbot Section - Only show when showChatbot is true */}
        {showChatbot && (
          <div className="flex-grow lg:w-1/2">
            <div className="flex-grow flex flex-col max-w-4xl w-full mx-auto">
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

              <div className="flex-grow flex flex-col bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden h-[70vh]">
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

                        <div
                          className={cn("text-xs mt-1", message.sender === "user" ? "text-blue-200" : "text-gray-400")}
                        >
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
                    Your data assistant can explain the report, analyze trends, and provide additional insights based on
                    your questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <BackgroundBeams /> */}
    </div>
  )
}
