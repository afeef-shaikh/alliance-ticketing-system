"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  options?: string[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "👋 Hi there! I'm your IT support assistant. How can I help you today?",
    sender: "bot",
  },
  {
    id: "2",
    content: "What do you need help with today?",
    sender: "bot",
    options: ["Password reset", "Creating a new ticket", "Checking ticket status", "Contact IT support"],
  },
]

const faqResponses: Record<string, string> = {
  "password reset":
    "To reset your password, please go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email.",
  "new ticket":
    "You can create a new ticket by logging in to the user dashboard and clicking on 'New Ticket' in the sidebar.",
  "ticket status": "You can check the status of your tickets in the 'All My Tickets' section of your dashboard.",
  "contact it": "You can reach the IT department at it-support@alliance.org or by phone at (555) 123-4567.",
  "software request":
    "For software requests, please submit a ticket with the 'Software' category and include details about the software you need.",
  "hardware issue":
    "For hardware issues, please submit a ticket with the 'Hardware' category and provide details about the problem you're experiencing.",
  "vpn access":
    "To request VPN access, submit a ticket with the 'Access Request' category and specify that you need VPN access.",
  "email problems":
    "If you're having email issues, submit a ticket with the 'Email' category and describe the problem in detail.",
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showOptions, setShowOptions] = useState(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (customMessage?: string) => {
    const messageText = customMessage || input
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(messageText)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
      }

      // Add options for certain responses
      if (botResponse.includes("Is there anything else")) {
        botMessage.options = ["Password reset", "Creating a new ticket", "Checking ticket status", "Contact IT support"]
        setShowOptions(true)
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Check for FAQ matches
    for (const [keyword, response] of Object.entries(faqResponses)) {
      if (input.includes(keyword)) {
        return response
      }
    }

    // Default responses
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! How can I assist you with IT support today?"
    }

    if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?"
    }

    if (input.includes("bye") || input.includes("goodbye")) {
      return "Goodbye! Feel free to come back if you have more questions."
    }

    return "I'm not sure I understand. Could you try rephrasing your question? You can ask about password resets, creating tickets, checking ticket status, or contacting IT support."
  }

  return (
    <>
      <div className="chatbot-trigger" onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} />
        <div className="sparkle sparkle1"></div>
        <div className="sparkle sparkle2"></div>
        <div className="sparkle sparkle3"></div>
      </div>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>IT Support Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`chatbot-message ${
                    message.sender === "bot" ? "chatbot-message-bot" : "chatbot-message-user"
                  }`}
                >
                  {message.content}
                </div>

                {message.options && message.sender === "bot" && showOptions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.options.map((option) => (
                      <button
                        key={option}
                        className="px-3 py-1 text-xs bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => {
                          setInput(option)
                          handleSendMessage(option)
                          setShowOptions(false)
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <button onClick={handleSendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

