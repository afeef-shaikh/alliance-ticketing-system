"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Upload, File, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Add notification functionality when creating a ticket
// Import necessary components
import { useToast } from "@/hooks/use-toast"

// Define the ticket type
interface Ticket {
  id: string
  title: string
  created: string
  updated: string
  priority: string
  status: string
  assignedTo: string
  description: string
  category?: string
  attachments: string[]
}

export default function NewTicket() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add this inside the component
  const { toast } = useToast()

  // Form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [description, setDescription] = useState("")

  // Add file upload functionality
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate form
    if (!title || !category || !priority || !description) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Create new ticket
    const newTicket: Ticket = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`, // Generate random ticket ID
      title,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      priority,
      status: "open",
      assignedTo: "Unassigned",
      description,
      category,
      attachments: files.map((file) => file.name),
    }

    // Get existing tickets from localStorage or initialize empty array
    const existingTickets = JSON.parse(localStorage.getItem("userTickets") || "[]")

    // Add new ticket to the array
    const updatedTickets = [newTicket, ...existingTickets]

    // Save updated tickets to localStorage
    localStorage.setItem("userTickets", JSON.stringify(updatedTickets))

    // Show notification to all users
    const notificationEvent = new CustomEvent("newTicketCreated", {
      detail: {
        id: newTicket.id,
        title: newTicket.title,
      },
    })
    window.dispatchEvent(notificationEvent)

    // Show success message
    toast({
      title: "Ticket Created",
      description: `Ticket ${newTicket.id} has been created successfully.`,
      variant: "default",
    })

    // Show success message
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Redirect to tickets page after 2 seconds
    setTimeout(() => {
      router.push("/dashboard/user/tickets")
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <DashboardLayout userType="user">
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-[hsl(var(--status-resolved))] text-primary-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your ticket has been submitted successfully. You will be redirected to your tickets page.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userType="user">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => setError(null)}>
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="user">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit a New Ticket</CardTitle>
            <CardDescription>Please provide details about your IT issue or request</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Ticket Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="access">Access Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority} required>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-low))] mr-2"></div>
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-medium))] mr-2"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-high))] mr-2"></div>
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="critical">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-critical))] mr-2"></div>
                          Critical
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Max file size: 10MB</p>
                  <Input id="attachments" type="file" className="hidden" multiple onChange={handleFileChange} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => document.getElementById("attachments")?.click()}
                  >
                    Select Files
                  </Button>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Selected Files:</p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                              <File className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-sm truncate max-w-[200px]">{file.name}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

