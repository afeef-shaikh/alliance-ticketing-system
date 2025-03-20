"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, Users, ClipboardList } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"

// Define the ticket type
interface Ticket {
  id: string
  title: string
  created: string
  updated: string
  priority: string
  status: string
  assignedTo: string
  submittedBy: string
  department?: string
  description: string
  category?: string
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // Sample data for charts
  const ticketTrends = [
    { month: "Jan", tickets: 45 },
    { month: "Feb", tickets: 52 },
    { month: "Mar", tickets: 49 },
    { month: "Apr", tickets: 62 },
    { month: "May", tickets: 58 },
    { month: "Jun", tickets: 65 },
  ]

  const resolutionTime = [
    { category: "Critical", time: 4 },
    { category: "High", time: 8 },
    { category: "Medium", time: 16 },
    { category: "Low", time: 24 },
  ]

  // Load tickets from localStorage on component mount
  useEffect(() => {
    // Try to get tickets from localStorage
    const storedTickets = localStorage.getItem("userTickets")

    if (storedTickets) {
      const parsedTickets = JSON.parse(storedTickets)
      // Add submittedBy and department if not present
      const enhancedTickets = parsedTickets.map((ticket: any) => ({
        ...ticket,
        submittedBy: ticket.submittedBy || "Jane Doe",
        department: ticket.department || "Operations",
      }))
      setTickets(enhancedTickets)
    }
  }, [])

  // Calculate ticket counts
  const openTickets = tickets.filter((ticket) => ticket.status === "open")
  const onHoldTickets = tickets.filter((ticket) => ticket.status === "onhold")
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved")
  const criticalTickets = tickets.filter((ticket) => ticket.priority === "critical")

  // Get filtered tickets based on active tab
  const getFilteredTickets = () => {
    let filteredTickets = [...tickets]

    if (activeTab === "critical") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.priority === "critical")
    } else if (activeTab === "unassigned") {
      filteredTickets = filteredTickets.filter((ticket) => !ticket.assignedTo || ticket.assignedTo === "Unassigned")
    } else if (activeTab === "overdue") {
      // For demo purposes, consider tickets older than 7 days and not resolved as overdue
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          new Date(ticket.created) < sevenDaysAgo && ticket.status !== "resolved" && ticket.status !== "closed",
      )
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
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of the IT support system.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tickets.length}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-open)/0.15)] border-[hsl(var(--status-open))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-[hsl(var(--status-open))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets.length}</div>
              <p className="text-xs text-muted-foreground">{criticalTickets.length} critical priority</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-onhold)/0.15)] border-[hsl(var(--status-onhold))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-[hsl(var(--status-onhold))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14.2h</div>
              <p className="text-xs text-muted-foreground">-2.3h from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-resolved)/0.15)] border-[hsl(var(--status-resolved))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-[hsl(var(--status-resolved))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+5 new this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Trends</CardTitle>
              <CardDescription>Monthly ticket volume over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  tickets: {
                    label: "Tickets",
                    color: "hsl(var(--alliance-blue-pastel))",
                  },
                }}
                className="h-[300px]"
              >
                <LineChart
                  data={ticketTrends}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    strokeWidth={2}
                    activeDot={{
                      r: 6,
                      style: { fill: "var(--color-tickets)", opacity: 0.8 },
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution Time by Priority</CardTitle>
              <CardDescription>Average resolution time in hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  time: {
                    label: "Hours",
                    color: "hsl(var(--alliance-green-pastel))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart
                  data={resolutionTime}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 50,
                    bottom: 0,
                  }}
                >
                  <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} />
                  <XAxis type="number" hide />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar dataKey="time" radius={4} fill="var(--color-time)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Tickets</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] p-4 text-sm font-medium">
                      <div>Ticket</div>
                      <div className="hidden md:block">Submitted By</div>
                      <div className="hidden md:block">Assigned To</div>
                      <div className="hidden md:block">Priority</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {getFilteredTickets().map((ticket) => (
                        <div
                          key={ticket.id}
                          className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50"
                        >
                          <div className="font-medium">{ticket.title}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">{ticket.submittedBy}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">
                            {ticket.assignedTo || "Unassigned"}
                          </div>
                          <div className="hidden md:block">{getPriorityBadge(ticket.priority)}</div>
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
            <TabsContent value="critical">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] p-4 text-sm font-medium">
                      <div>Ticket</div>
                      <div className="hidden md:block">Submitted By</div>
                      <div className="hidden md:block">Assigned To</div>
                      <div className="hidden md:block">Priority</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {getFilteredTickets().map((ticket) => (
                        <div
                          key={ticket.id}
                          className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50"
                        >
                          <div className="font-medium">{ticket.title}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">{ticket.submittedBy}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">
                            {ticket.assignedTo || "Unassigned"}
                          </div>
                          <div className="hidden md:block">{getPriorityBadge(ticket.priority)}</div>
                          <div>{getStatusBadge(ticket.status)}</div>
                        </div>
                      ))}
                      {getFilteredTickets().length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">No critical tickets found</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="unassigned">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] p-4 text-sm font-medium">
                      <div>Ticket</div>
                      <div className="hidden md:block">Submitted By</div>
                      <div className="hidden md:block">Assigned To</div>
                      <div className="hidden md:block">Priority</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {getFilteredTickets().map((ticket) => (
                        <div
                          key={ticket.id}
                          className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50"
                        >
                          <div className="font-medium">{ticket.title}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">{ticket.submittedBy}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">
                            {ticket.assignedTo || "Unassigned"}
                          </div>
                          <div className="hidden md:block">{getPriorityBadge(ticket.priority)}</div>
                          <div>{getStatusBadge(ticket.status)}</div>
                        </div>
                      ))}
                      {getFilteredTickets().length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">No unassigned tickets found</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="overdue">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] p-4 text-sm font-medium">
                      <div>Ticket</div>
                      <div className="hidden md:block">Submitted By</div>
                      <div className="hidden md:block">Assigned To</div>
                      <div className="hidden md:block">Priority</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {getFilteredTickets().map((ticket) => (
                        <div
                          key={ticket.id}
                          className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50"
                        >
                          <div className="font-medium">{ticket.title}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">{ticket.submittedBy}</div>
                          <div className="hidden md:block text-sm text-muted-foreground">
                            {ticket.assignedTo || "Unassigned"}
                          </div>
                          <div className="hidden md:block">{getPriorityBadge(ticket.priority)}</div>
                          <div>{getStatusBadge(ticket.status)}</div>
                        </div>
                      ))}
                      {getFilteredTickets().length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">No overdue tickets found</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

