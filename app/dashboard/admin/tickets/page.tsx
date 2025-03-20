"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Filter, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Make ticket action buttons functional
// Add these imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Define the ticket type
interface Ticket {
  id: string
  title: string
  submittedBy: string
  department: string
  assignedTo: string
  priority: string
  status: string
  created: string
  updated: string
  description: string
}

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")

  // Add these states
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignTo, setAssignTo] = useState("")
  const [newPriority, setNewPriority] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const { toast } = useToast()

  // Sample ticket data
  const sampleTickets: Ticket[] = [
    {
      id: "T-1001",
      title: "Server outage in Toronto office",
      submittedBy: "Jane Doe",
      department: "Operations",
      assignedTo: "Tech Team",
      priority: "critical",
      status: "open",
      created: "2025-03-15T10:30:00",
      updated: "2025-03-15T14:45:00",
      description: "All servers in Toronto office are down. Users cannot access any network resources.",
    },
    {
      id: "T-1002",
      title: "VPN access for new employee",
      submittedBy: "HR Department",
      department: "Human Resources",
      assignedTo: "John Smith",
      priority: "high",
      status: "onhold",
      created: "2025-03-14T09:15:00",
      updated: "2025-03-15T11:20:00",
      description: "New employee starting next week needs VPN access set up.",
    },
    {
      id: "T-1003",
      title: "Shared drive access request",
      submittedBy: "Marketing Team",
      department: "Marketing",
      assignedTo: "",
      priority: "medium",
      status: "open",
      created: "2025-03-13T16:45:00",
      updated: "2025-03-14T08:30:00",
      description: "Need access to the shared marketing drive for the new campaign.",
    },
    {
      id: "T-1004",
      title: "Software license renewal",
      submittedBy: "Finance Dept",
      department: "Finance",
      assignedTo: "Admin Team",
      priority: "low",
      status: "resolved",
      created: "2025-03-10T11:00:00",
      updated: "2025-03-12T15:30:00",
      description: "Adobe Creative Cloud licenses need to be renewed by end of month.",
    },
    {
      id: "T-1005",
      title: "Email delivery issues",
      submittedBy: "Communications",
      department: "Communications",
      assignedTo: "Email Admin",
      priority: "high",
      status: "open",
      created: "2025-03-15T08:20:00",
      updated: "2025-03-15T09:45:00",
      description: "Emails to external domains are being delayed or not delivered.",
    },
    {
      id: "T-1006",
      title: "Printer configuration",
      submittedBy: "Reception",
      department: "Administration",
      assignedTo: "Support Team",
      priority: "low",
      status: "resolved",
      created: "2025-03-11T14:30:00",
      updated: "2025-03-12T10:15:00",
      description: "New printer in reception area needs to be configured for all staff.",
    },
    {
      id: "T-1007",
      title: "Password reset request",
      submittedBy: "John Miller",
      department: "Sales",
      assignedTo: "",
      priority: "medium",
      status: "open",
      created: "2025-03-15T11:45:00",
      updated: "2025-03-15T11:45:00",
      description: "Unable to log in to CRM system, need password reset.",
    },
    {
      id: "T-1008",
      title: "Video conferencing setup",
      submittedBy: "Executive Office",
      department: "Executive",
      assignedTo: "AV Team",
      priority: "high",
      status: "onhold",
      created: "2025-03-12T09:30:00",
      updated: "2025-03-14T16:20:00",
      description: "Need to set up video conferencing in the main boardroom for next week's meeting.",
    },
  ]

  // Load tickets from localStorage on component mount
  useEffect(() => {
    // Try to get tickets from localStorage
    const storedTickets = localStorage.getItem("userTickets")

    if (storedTickets) {
      const parsedTickets = JSON.parse(storedTickets)
      // Add admin-specific fields if not present
      const enhancedTickets = parsedTickets.map((ticket: any) => ({
        ...ticket,
        submittedBy: ticket.submittedBy || "Jane Doe",
        department: ticket.department || "Operations",
      }))

      // Combine with sample tickets to ensure we have a good mix
      const combinedTickets = [
        ...enhancedTickets,
        ...sampleTickets.filter((t) => !enhancedTickets.some((et: any) => et.id === t.id)),
      ]

      setTickets(combinedTickets)
    } else {
      setTickets(sampleTickets)
    }
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter and sort tickets
  const getFilteredTickets = () => {
    let filteredTickets = [...tickets]

    // Apply search filter
    if (searchQuery) {
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === activeTab)
    }

    // Apply advanced filters
    if (priorityFilter !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.priority === priorityFilter)
    }

    if (statusFilter !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === statusFilter)
    }

    if (departmentFilter !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.department === departmentFilter)
    }

    if (assigneeFilter !== "all") {
      if (assigneeFilter === "unassigned") {
        filteredTickets = filteredTickets.filter((ticket) => !ticket.assignedTo || ticket.assignedTo === "")
      } else {
        filteredTickets = filteredTickets.filter((ticket) => ticket.assignedTo === assigneeFilter)
      }
    }

    // Apply sorting
    if (sortField) {
      filteredTickets.sort((a, b) => {
        const aValue = a[sortField as keyof Ticket]
        const bValue = b[sortField as keyof Ticket]

        // Handle date fields
        if (sortField === "created" || sortField === "updated") {
          return sortDirection === "asc"
            ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
            : new Date(bValue as string).getTime() - new Date(aValue as string).getTime()
        }

        // Handle string fields
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        return 0
      })
    }

    return filteredTickets
  }

  // Add these functions to handle ticket actions
  const handleAssignTicket = () => {
    if (!selectedTicket || !assignTo) return

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id ? { ...ticket, assignedTo: assignTo, updated: new Date().toISOString() } : ticket,
    )

    setTickets(updatedTickets)
    setAssignDialogOpen(false)
    setAssignTo("")

    toast({
      title: "Ticket Assigned",
      description: `Ticket ${selectedTicket.id} has been assigned to ${assignTo}.`,
    })
  }

  const handleChangePriority = () => {
    if (!selectedTicket || !newPriority) return

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, priority: newPriority, updated: new Date().toISOString() }
        : ticket,
    )

    setTickets(updatedTickets)
    setPriorityDialogOpen(false)

    toast({
      title: "Priority Updated",
      description: `Ticket ${selectedTicket.id} priority changed to ${newPriority}.`,
    })
  }

  const handleChangeStatus = () => {
    if (!selectedTicket || !newStatus) return

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id ? { ...ticket, status: newStatus, updated: new Date().toISOString() } : ticket,
    )

    setTickets(updatedTickets)
    setStatusDialogOpen(false)
    setStatusNote("")

    toast({
      title: "Status Updated",
      description: `Ticket ${selectedTicket.id} status changed to ${newStatus}.`,
    })
  }

  const handleDeleteTicket = () => {
    if (!selectedTicket) return

    const updatedTickets = tickets.filter((ticket) => ticket.id !== selectedTicket.id)
    setTickets(updatedTickets)
    setDeleteDialogOpen(false)

    toast({
      title: "Ticket Deleted",
      description: `Ticket ${selectedTicket.id} has been deleted.`,
      variant: "destructive",
    })
  }

  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
          <p className="text-muted-foreground">View and manage all support tickets in the system</p>
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
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assign">Assign Tickets</SelectItem>
                <SelectItem value="priority">Change Priority</SelectItem>
                <SelectItem value="status">Change Status</SelectItem>
                <SelectItem value="delete">Delete Tickets</SelectItem>
              </SelectContent>
            </Select>
            <Button>Apply</Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="onhold">On Hold</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assigned To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Technicians</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="Tech Team">Tech Team</SelectItem>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Admin Team">Admin Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("id")}>
                        <div className="flex items-center gap-1">ID {getSortIcon("id")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                        <div className="flex items-center gap-1">Title {getSortIcon("title")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("submittedBy")}>
                        <div className="flex items-center gap-1">Submitted By {getSortIcon("submittedBy")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("assignedTo")}>
                        <div className="flex items-center gap-1">Assigned To {getSortIcon("assignedTo")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
                        <div className="flex items-center gap-1">Priority {getSortIcon("priority")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        <div className="flex items-center gap-1">Status {getSortIcon("status")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("updated")}>
                        <div className="flex items-center gap-1">Last Updated {getSortIcon("updated")}</div>
                      </TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTickets().map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.submittedBy}</TableCell>
                        <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{formatDate(ticket.updated)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setViewDialogOpen(true)
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setAssignDialogOpen(true)
                                }}
                              >
                                Assign Ticket
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setNewPriority(ticket.priority)
                                  setPriorityDialogOpen(true)
                                }}
                              >
                                Change Priority
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setNewStatus(ticket.status)
                                  setStatusDialogOpen(true)
                                }}
                              >
                                Change Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No tickets found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTickets().map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.submittedBy}</TableCell>
                        <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{formatDate(ticket.updated)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No open tickets found
                        </TableCell>
                      </TableRow>
                    )}
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
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTickets().map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.submittedBy}</TableCell>
                        <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{formatDate(ticket.updated)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No on-hold tickets found
                        </TableCell>
                      </TableRow>
                    )}
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
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTickets().map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.submittedBy}</TableCell>
                        <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{formatDate(ticket.updated)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No resolved tickets found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="closed">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTickets().map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.submittedBy}</TableCell>
                        <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{formatDate(ticket.updated)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getFilteredTickets().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No closed tickets found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>View detailed information about this ticket</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Ticket ID</Label>
                  <div className="font-medium">{selectedTicket.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Priority</Label>
                  <div>{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <div className="font-medium">{selectedTicket.assignedTo || "Unassigned"}</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Title</Label>
                <div className="font-medium text-lg">{selectedTicket.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Submitted By</Label>
                  <div className="font-medium">{selectedTicket.submittedBy}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Department</Label>
                  <div className="font-medium">{selectedTicket.department}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Created</Label>
                  <div>{formatDate(selectedTicket.created)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <div>{formatDate(selectedTicket.updated)}</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Description</Label>
                <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">{selectedTicket.description}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Ticket Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>Assign this ticket to a technician or team</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Ticket</Label>
                <div className="font-medium">
                  {selectedTicket.id}: {selectedTicket.title}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignTo">Assign To</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger id="assignTo">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tech Team">Tech Team</SelectItem>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="David Lee">David Lee</SelectItem>
                    <SelectItem value="Email Admin">Email Admin</SelectItem>
                    <SelectItem value="Network Team">Network Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTicket} disabled={!assignTo}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Priority Dialog */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Priority</DialogTitle>
            <DialogDescription>Update the priority level of this ticket</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Ticket</Label>
                <div className="font-medium">
                  {selectedTicket.id}: {selectedTicket.title}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-critical))] mr-2"></div>
                        Critical
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-high))] mr-2"></div>
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-medium))] mr-2"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--priority-low))] mr-2"></div>
                        Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPriorityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePriority}>Update Priority</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>Update the status of this ticket</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Ticket</Label>
                <div className="font-medium">
                  {selectedTicket.id}: {selectedTicket.title}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="onhold">On Hold</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusNote">Add a note (optional)</Label>
                <Textarea
                  id="statusNote"
                  placeholder="Add details about this status change"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ticket Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="py-4">
              <div className="font-medium">
                {selectedTicket.id}: {selectedTicket.title}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTicket}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

