import type React from "react"
import { AIChatbot } from "@/components/ai-chatbot"

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <AIChatbot />
    </>
  )
}

