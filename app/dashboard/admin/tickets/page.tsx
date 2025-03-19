"use client"

import { useState } from "react"
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

// Sample ticket data
const tickets = [
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
  },
]

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

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
        return <Badge className="bg-  text-primary-foreground">High</Badge>
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
                  <Select>
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
                  <Select>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assigned To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Technicians</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="tech-team">Tech Team</SelectItem>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="admin-team">Admin Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="all" className="w-full">
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
                    {tickets.map((ticket) => (
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
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Assign Ticket</DropdownMenuItem>
                              <DropdownMenuItem>Change Priority</DropdownMenuItem>
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="open">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">Showing open tickets only</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="onhold">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">Showing on-hold tickets only</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resolved">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">Showing resolved tickets only</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="closed">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">Showing closed tickets only</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

