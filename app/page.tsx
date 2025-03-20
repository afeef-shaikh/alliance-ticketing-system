"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "next-themes"

export default function Home() {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fix dark mode functionality
  // Remove the line that forces light theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="wave wave4"></div>

        {/* Floating circles */}
        <div className="floating-circle circle1"></div>
        <div className="floating-circle circle2"></div>
        <div className="floating-circle circle3"></div>
        <div className="floating-circle circle4"></div>
        <div className="floating-circle circle5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full px-4">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vBpw3Gd4BCDJiY6oztvM68hJY0moN9.png"
              alt="Alliance for Healthier Communities Logo"
              width={350}
              height={120}
              className="mx-auto"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-alliance-blue dark:from-primary dark:to-alliance-blue">
            IT Ticketing System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Streamlined support for Alliance for Healthier Communities - empowering health equity through efficient IT
            solutions
          </p>

          <div className="max-w-xs mx-auto bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-8 border border-primary/20">
            <p className="italic text-sm text-muted-foreground">
              "The Alliance for Healthier Communities is the voice of community-governed primary health care in Ontario,
              championing health equity and community wellbeing."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 dark:bg-black/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-alliance-green flex items-center justify-center mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Employees & Members</h2>
              <p className="text-center text-muted-foreground">
                Submit and track your IT support tickets. Get quick resolutions to your technical issues.
              </p>
              <Button asChild size="lg" className="w-full mt-4">
                <Link href="/dashboard/user">Login as User</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 dark:bg-black/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-alliance-blue flex items-center justify-center mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Technicians & Admins</h2>
              <p className="text-center text-muted-foreground">
                Process, update, and resolve tickets. Manage IT resources efficiently.
              </p>
              <Button asChild size="lg" className="w-full mt-4">
                <Link href="/dashboard/admin">Login as Admin</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Alliance for Healthier Communities. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

