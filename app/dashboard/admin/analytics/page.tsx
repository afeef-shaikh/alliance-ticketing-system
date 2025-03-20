"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Fix the analytics page to prevent runtime errors
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const ticketTrends = [
    { month: "Jan", tickets: 45, resolved: 40 },
    { month: "Feb", tickets: 52, resolved: 48 },
    { month: "Mar", tickets: 49, resolved: 45 },
    { month: "Apr", tickets: 62, resolved: 55 },
    { month: "May", tickets: 58, resolved: 52 },
    { month: "Jun", tickets: 65, resolved: 58 },
  ]

  const ticketsByPriority = [
    { name: "Critical", value: 15, color: "hsl(var(--priority-critical))" },
    { name: "High", value: 25, color: "hsl(var(--priority-high))" },
    { name: "Medium", value: 35, color: "hsl(var(--priority-medium))" },
    { name: "Low", value: 25, color: "hsl(var(--priority-low))" },
  ]

  const ticketsByDepartment = [
    { department: "Operations", tickets: 28 },
    { department: "Finance", tickets: 15 },
    { department: "HR", tickets: 12 },
    { department: "Marketing", tickets: 8 },
    { department: "IT", tickets: 22 },
    { department: "Executive", tickets: 5 },
  ]

  const resolutionTimeByPriority = [
    { priority: "Critical", time: 4 },
    { priority: "High", time: 8 },
    { priority: "Medium", time: 16 },
    { priority: "Low", time: 24 },
  ]

  const technicianPerformance = [
    { name: "John Smith", resolved: 48, avgTime: 6.2 },
    { name: "David Lee", resolved: 32, avgTime: 8.5 },
    { name: "Sarah Johnson", resolved: 45, avgTime: 5.8 },
    { name: "Michael Chen", resolved: 38, avgTime: 7.3 },
  ]

  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Insights and statistics for your IT support system</p>
          </div>

          <div className="w-full md:w-48">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">Ticket Analysis</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="satisfaction">User Satisfaction</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-[hsl(var(--status-open)/0.15)] border-[hsl(var(--status-open))]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">331</div>
                  <p className="text-xs text-muted-foreground">+12% from previous period</p>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--status-resolved)/0.15)] border-[hsl(var(--status-resolved))]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89.2%</div>
                  <p className="text-xs text-muted-foreground">+3.5% from previous period</p>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--status-onhold)/0.15)] border-[hsl(var(--status-onhold))]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14.2h</div>
                  <p className="text-xs text-muted-foreground">-2.3h from previous period</p>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--alliance-blue-pastel)/0.3)] border-[hsl(var(--alliance-blue-pastel))]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.7/5</div>
                  <p className="text-xs text-muted-foreground">+0.2 from previous period</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Trends</CardTitle>
                  <CardDescription>Monthly ticket volume and resolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        New Tickets
                                      </span>
                                      <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Resolved</span>
                                      <span className="font-bold text-muted-foreground">{payload[1].value}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                          cursor={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="tickets"
                          stroke="hsl(var(--alliance-blue-pastel))"
                          strokeWidth={2}
                          activeDot={{
                            r: 6,
                            style: { fill: "hsl(var(--alliance-blue-pastel))", opacity: 0.8 },
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="resolved"
                          stroke="hsl(var(--alliance-green-pastel))"
                          strokeWidth={2}
                          activeDot={{
                            r: 6,
                            style: { fill: "hsl(var(--alliance-green-pastel))", opacity: 0.8 },
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tickets by Priority</CardTitle>
                  <CardDescription>Distribution of tickets by priority level</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[300px] w-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketsByPriority}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {ticketsByPriority.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {payload[0].name}
                                    </span>
                                    <span className="font-bold text-muted-foreground">{payload[0].value} tickets</span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets by Department</CardTitle>
                  <CardDescription>Number of tickets submitted by each department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ticketsByDepartment}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 10,
                          left: 80,
                          bottom: 0,
                        }}
                      >
                        <YAxis type="category" dataKey="department" tickLine={false} axisLine={false} />
                        <XAxis type="number" hide />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {payload[0].payload.department}
                                    </span>
                                    <span className="font-bold text-muted-foreground">{payload[0].value} tickets</span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                          cursor={false}
                        />
                        <Bar dataKey="tickets" radius={4} fill="hsl(var(--alliance-yellow-pastel))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resolution Time by Priority</CardTitle>
                  <CardDescription>Average resolution time in hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={resolutionTimeByPriority}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 10,
                          left: 80,
                          bottom: 0,
                        }}
                      >
                        <YAxis type="category" dataKey="priority" tickLine={false} axisLine={false} />
                        <XAxis type="number" hide />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {payload[0].payload.priority}
                                    </span>
                                    <span className="font-bold text-muted-foreground">{payload[0].value} hours</span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                          cursor={false}
                        />
                        <Bar dataKey="time" radius={4} fill="hsl(var(--alliance-green-pastel))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Ticket Analysis</CardTitle>
                <CardDescription>More detailed ticket analytics will be shown here</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Detailed ticket analysis dashboard coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Performance metrics for IT support team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {technicianPerformance.map((tech) => (
                    <div key={tech.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {tech.resolved} tickets resolved | Avg. time: {tech.avgTime}h
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(tech.resolved / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Satisfaction</CardTitle>
                <CardDescription>Feedback and satisfaction metrics from users</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">User satisfaction dashboard coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

