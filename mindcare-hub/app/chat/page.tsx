"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Send, ArrowLeft } from "lucide-react"
import styles from "./chat.module.css"

interface Message {
  id: string
  sender: "user" | "psychiatrist"
  text: string
  timestamp: Date
}

interface Psychiatrist {
  id: number
  name: string
  image: string
  status: "online" | "offline"
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([])
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState<Psychiatrist | null>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    // Load mock psychiatrists
    const mockPsychiatrists: Psychiatrist[] = [
      { id: 1, name: "Dr. John Smith", image: "/placeholder.svg?height=50&width=50", status: "online" },
      { id: 2, name: "Dr. Sarah Johnson", image: "/placeholder.svg?height=50&width=50", status: "offline" },
      { id: 3, name: "Dr. Michael Chen", image: "/placeholder.svg?height=50&width=50", status: "online" },
    ]

    setPsychiatrists(mockPsychiatrists)
    setLoading(false)
  }, [router])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPsychiatrist) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate psychiatrist response after a delay
    setTimeout(() => {
      const psychiatristMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "psychiatrist",
        text: getAutomaticResponse(newMessage),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, psychiatristMessage])
    }, 1000)
  }

  const getAutomaticResponse = (message: string): string => {
    // Simple automatic responses for demo purposes
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      return `Hello! How are you feeling today?`
    } else if (message.toLowerCase().includes("appointment")) {
      return `If you'd like to schedule an appointment, you can do so from the Appointments section. When would you prefer to meet?`
    } else if (message.toLowerCase().includes("anxious") || message.toLowerCase().includes("anxiety")) {
      return `I understand that anxiety can be challenging. Can you tell me more about what you're experiencing?`
    } else if (message.toLowerCase().includes("sad") || message.toLowerCase().includes("depressed")) {
      return `I'm sorry to hear you're feeling this way. It's important to talk about these feelings. Would you like to share more about what's been going on?`
    } else {
      return `Thank you for sharing. How else can I help you today?`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const selectPsychiatrist = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist)
    // Clear previous messages when selecting a new psychiatrist
    setMessages([
      {
        id: "1",
        sender: "psychiatrist",
        text: `Hello! I'm ${psychiatrist.name}. How can I help you today?`,
        timestamp: new Date(),
      },
    ])
  }

  if (loading) {
    return <div className={styles.loading}>Loading chat...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.sidebar}>
          <h2>Conversations</h2>
          <div className={styles.psychiatristList}>
            {psychiatrists.map((psychiatrist) => (
              <div
                key={psychiatrist.id}
                className={`${styles.psychiatristItem} ${selectedPsychiatrist?.id === psychiatrist.id ? styles.selected : ""}`}
                onClick={() => selectPsychiatrist(psychiatrist)}
              >
                <div className={styles.psychiatristAvatar}>
                  <img src={psychiatrist.image || "/placeholder.svg"} alt={psychiatrist.name} />
                  <span
                    className={`${styles.statusIndicator} ${psychiatrist.status === "online" ? styles.online : styles.offline}`}
                  ></span>
                </div>
                <div className={styles.psychiatristInfo}>
                  <h3>{psychiatrist.name}</h3>
                  <p>{psychiatrist.status === "online" ? "Online" : "Offline"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chatMain}>
          {selectedPsychiatrist ? (
            <>
              <div className={styles.chatHeader}>
                <Button variant="ghost" className={styles.backButton} onClick={() => setSelectedPsychiatrist(null)}>
                  <ArrowLeft size={16} />
                </Button>
                <div className={styles.chatHeaderAvatar}>
                  <img src={selectedPsychiatrist.image || "/placeholder.svg"} alt={selectedPsychiatrist.name} />
                  <span
                    className={`${styles.statusIndicator} ${selectedPsychiatrist.status === "online" ? styles.online : styles.offline}`}
                  ></span>
                </div>
                <div className={styles.chatHeaderInfo}>
                  <h3>{selectedPsychiatrist.name}</h3>
                  <p>{selectedPsychiatrist.status === "online" ? "Online" : "Offline"}</p>
                </div>
              </div>

              <div className={styles.messagesContainer}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${message.sender === "user" ? styles.userMessage : styles.psychiatristMessage}`}
                  >
                    <div className={styles.messageContent}>
                      <p>{message.text}</p>
                      <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.inputContainer}>
                <textarea
                  className={styles.messageInput}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button className={styles.sendButton} onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className={styles.noChatSelected}>
              <div className={styles.noChatContent}>
                <h2>Welcome to MindCare Chat</h2>
                <p>Select a psychiatrist from the list to start a conversation.</p>
                <p className={styles.disclaimer}>
                  Note: This is a demo chat. In a real application, these would be your actual conversations with
                  psychiatrists.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

