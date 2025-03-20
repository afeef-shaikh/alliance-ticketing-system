"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Clock, Plus, ClipboardList } from "lucide-react"
import Link from "next/link"

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
}

export default function UserDashboard() {
  const [userTickets, setUserTickets] = useState<Ticket[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // Load tickets from localStorage on component mount
  useEffect(() => {
    // Try to get tickets from localStorage
    const storedTickets = localStorage.getItem("userTickets")

    if (storedTickets) {
      setUserTickets(JSON.parse(storedTickets))
    }
  }, [])

  // Calculate ticket counts
  const openTickets = userTickets.filter((ticket) => ticket.status === "open")
  const onHoldTickets = userTickets.filter((ticket) => ticket.status === "onhold")
  const resolvedTickets = userTickets.filter((ticket) => ticket.status === "resolved")
  const highPriorityOpenTickets = openTickets.filter(
    (ticket) => ticket.priority === "high" || ticket.priority === "critical",
  )
  const awaitingResponseTickets = onHoldTickets.filter((ticket) => ticket.assignedTo !== "")

  // Get the most recent tickets based on the active tab
  const getFilteredTickets = () => {
    let filteredTickets = [...userTickets]

    // Apply status filter based on active tab
    if (activeTab === "open") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === "open")
    } else if (activeTab === "onhold") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === "onhold")
    } else if (activeTab === "resolved") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === "resolved")
    }

    // Sort by update date (newest first)
    filteredTickets.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())

    // Return the 4 most recent tickets
    return filteredTickets.slice(0, 4)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-[hsl(var(--priority-critical))] text-primary-foreground">Critical</Badge>
      case "high":
        return <Badge className="bg-[hsl(var(--priority-high))] text-primary-foreground">High</Badge>
      case "medium":
        return <Badge className="bg-[hsl(var(--priority-medium))] text-primary-foreground">Medium</Badge>
      case "low":
        return <Badge className="bg-[hsl(var(--priority-low))] text-primary-foreground">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-[hsl(var(--status-open))] text-primary-foreground">Open</Badge>
      case "onhold":
        return <Badge className="bg-[hsl(var(--status-onhold))] text-primary-foreground">On Hold</Badge>
      case "resolved":
        return <Badge className="bg-[hsl(var(--status-resolved))] text-primary-foreground">Resolved</Badge>
      case "closed":
        return <Badge className="bg-[hsl(var(--status-closed))] text-primary-foreground">Closed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <DashboardLayout userType="user">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Jane! Here's an overview of your IT support tickets.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTickets.length}</div>
              <p className="text-xs text-muted-foreground">All tickets in the system</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-open)/0.15)] border-[hsl(var(--status-open))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-[hsl(var(--status-open))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets.length}</div>
              <p className="text-xs text-muted-foreground">{highPriorityOpenTickets.length} high priority</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-onhold)/0.15)] border-[hsl(var(--status-onhold))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Hold</CardTitle>
              <Clock className="h-4 w-4 text-[hsl(var(--status-onhold))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onHoldTickets.length}</div>
              <p className="text-xs text-muted-foreground">{awaitingResponseTickets.length} awaiting your response</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-resolved)/0.15)] border-[hsl(var(--status-resolved))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--status-resolved))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedTickets.length}</div>
              <p className="text-xs text-muted-foreground">Resolved this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Tickets</h2>
          <Button asChild>
            <Link href="/dashboard/user/tickets/new">
              <Plus className="mr-2 h-4 w-4" /> New Ticket
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="onhold">On Hold</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] p-4 text-sm font-medium">
                    <div>Ticket</div>
                    <div className="hidden md:block">Created</div>
                    <div className="hidden md:block">Updated</div>
                    <div className="hidden lg:block">Priority</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {getFilteredTickets().map((ticket) => (
                      <div
                        key={ticket.id}
                        className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50"
                      >
                        <div className="font-medium">{ticket.title}</div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.created)}
                        </div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.updated)}
                        </div>
                        <div className="hidden lg:block">{getPriorityBadge(ticket.priority)}</div>
                        <div>{getStatusBadge(ticket.status)}</div>
                      </div>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">No tickets found</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="open">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] p-4 text-sm font-medium">
                    <div>Ticket</div>
                    <div className="hidden md:block">Created</div>
                    <div className="hidden md:block">Updated</div>
                    <div className="hidden lg:block">Priority</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {getFilteredTickets().map((ticket) => (
                      <div
                        key={ticket.id}
                        className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50"
                      >
                        <div className="font-medium">{ticket.title}</div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.created)}
                        </div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.updated)}
                        </div>
                        <div className="hidden lg:block">{getPriorityBadge(ticket.priority)}</div>
                        <div>{getStatusBadge(ticket.status)}</div>
                      </div>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">No open tickets found</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="onhold">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] p-4 text-sm font-medium">
                    <div>Ticket</div>
                    <div className="hidden md:block">Created</div>
                    <div className="hidden md:block">Updated</div>
                    <div className="hidden lg:block">Priority</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {getFilteredTickets().map((ticket) => (
                      <div
                        key={ticket.id}
                        className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50"
                      >
                        <div className="font-medium">{ticket.title}</div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.created)}
                        </div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.updated)}
                        </div>
                        <div className="hidden lg:block">{getPriorityBadge(ticket.priority)}</div>
                        <div>{getStatusBadge(ticket.status)}</div>
                      </div>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">No on-hold tickets found</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resolved">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] p-4 text-sm font-medium">
                    <div>Ticket</div>
                    <div className="hidden md:block">Created</div>
                    <div className="hidden md:block">Updated</div>
                    <div className="hidden lg:block">Priority</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {getFilteredTickets().map((ticket) => (
                      <div
                        key={ticket.id}
                        className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50"
                      >
                        <div className="font-medium">{ticket.title}</div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.created)}
                        </div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {formatDate(ticket.updated)}
                        </div>
                        <div className="hidden lg:block">{getPriorityBadge(ticket.priority)}</div>
                        <div>{getStatusBadge(ticket.status)}</div>
                      </div>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">No resolved tickets found</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

