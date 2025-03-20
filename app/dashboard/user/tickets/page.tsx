"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

// Sample ticket data for the user
const sampleTickets: Ticket[] = [
  {
    id: "T-1001",
    title: "Network connectivity issues",
    created: "2025-03-15T10:30:00",
    updated: "2025-03-16T14:45:00",
    priority: "high",
    status: "open",
    assignedTo: "Tech Team",
    description: "Unable to connect to the network in the Toronto office. Affects multiple workstations.",
  },
  {
    id: "T-1002",
    title: "Software installation request",
    created: "2025-03-12T09:15:00",
    updated: "2025-03-14T11:20:00",
    priority: "medium",
    status: "onhold",
    assignedTo: "John Smith",
    description: "Need Adobe Creative Suite installed on my workstation for the new marketing project.",
  },
  {
    id: "T-1003",
    title: "Email access problem",
    created: "2025-03-10T16:45:00",
    updated: "2025-03-13T08:30:00",
    priority: "critical",
    status: "resolved",
    assignedTo: "Email Admin",
    description: "Cannot access my email account. Getting authentication errors when trying to log in.",
  },
  {
    id: "T-1004",
    title: "Printer not working",
    created: "2025-03-08T11:00:00",
    updated: "2025-03-09T15:30:00",
    priority: "low",
    status: "resolved",
    assignedTo: "Support Team",
    description: "The shared printer on the 2nd floor is not responding to print jobs.",
  },
  {
    id: "T-1005",
    title: "VPN connection issues",
    created: "2025-03-05T08:20:00",
    updated: "2025-03-07T09:45:00",
    priority: "high",
    status: "open",
    assignedTo: "Network Team",
    description: "Cannot establish VPN connection when working remotely. Error message says 'Connection timed out'.",
  },
  {
    id: "T-1006",
    title: "Monitor flickering",
    created: "2025-03-03T14:30:00",
    updated: "2025-03-04T10:15:00",
    priority: "medium",
    status: "resolved",
    assignedTo: "Hardware Support",
    description: "My monitor screen is flickering intermittently, making it difficult to work.",
  },
  {
    id: "T-1007",
    title: "Password reset request",
    created: "2025-03-01T11:45:00",
    updated: "2025-03-01T12:30:00",
    priority: "medium",
    status: "resolved",
    assignedTo: "Help Desk",
    description: "Need to reset my password for the CRM system.",
  },
  {
    id: "T-1008",
    title: "New laptop request",
    created: "2025-02-28T09:30:00",
    updated: "2025-03-02T16:20:00",
    priority: "low",
    status: "onhold",
    assignedTo: "IT Procurement",
    description: "Requesting a new laptop as my current one is over 4 years old and running slowly.",
  },
]

export default function UserTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [userTickets, setUserTickets] = useState<Ticket[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // Fix search functionality and add search button
  // Update the filter section
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Load tickets from localStorage on component mount
  useEffect(() => {
    // Try to get tickets from localStorage
    const storedTickets = localStorage.getItem("userTickets")

    if (storedTickets) {
      // If tickets exist in localStorage, use them
      setUserTickets(JSON.parse(storedTickets))
    } else {
      // Otherwise, use sample tickets and store them in localStorage
      setUserTickets(sampleTickets)
      localStorage.setItem("userTickets", JSON.stringify(sampleTickets))
    }
  }, [])

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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Update the getFilteredTickets function
  const getFilteredTickets = () => {
    let filteredTickets = [...userTickets]

    // Apply search filter
    if (searchQuery) {
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter from tabs
    if (activeTab !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === activeTab)
    }

    // Apply advanced filters
    if (priorityFilter !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.priority === priorityFilter)
    }

    if (statusFilter !== "all" && activeTab === "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === statusFilter)
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      if (dateFilter === "today") {
        cutoffDate.setHours(0, 0, 0, 0)
      } else if (dateFilter === "week") {
        cutoffDate.setDate(now.getDate() - 7)
      } else if (dateFilter === "month") {
        cutoffDate.setMonth(now.getMonth() - 1)
      } else if (dateFilter === "quarter") {
        cutoffDate.setMonth(now.getMonth() - 3)
      }

      filteredTickets = filteredTickets.filter((ticket) => new Date(ticket.created) >= cutoffDate)
    }

    return filteredTickets
  }

  // Filter tickets based on search query
  const filteredTickets = getFilteredTickets()

  return (
    <DashboardLayout userType="user">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">All My Tickets</h1>
          <p className="text-muted-foreground">View and track all your IT support tickets</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button asChild>
              <Link href="/dashboard/user/tickets/new">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Link>
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Filter Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="onhold">On Hold</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date Range</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">Last 3 Months</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => {
                    // Apply filters
                    setShowFilters(false)
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                {filteredTickets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
                        <TableHead className="hidden md:table-cell">Updated</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.created)}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.updated)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="mb-2 text-muted-foreground">No tickets found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="open">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="hidden md:table-cell">Updated</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTickets
                      .filter((ticket) => ticket.status === "open")
                      .map((ticket) => (
                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.created)}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.updated)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="onhold">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="hidden md:table-cell">Updated</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTickets
                      .filter((ticket) => ticket.status === "onhold")
                      .map((ticket) => (
                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.created)}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.updated)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resolved">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="hidden md:table-cell">Updated</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTickets
                      .filter((ticket) => ticket.status === "resolved")
                      .map((ticket) => (
                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.created)}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.updated)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

