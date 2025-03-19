import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, Users } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"

export default function AdminDashboard() {
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

  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of the IT support system.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-alliance-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27</div>
              <p className="text-xs text-muted-foreground">8 critical priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-alliance-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14.2h</div>
              <p className="text-xs text-muted-foreground">-2.3h from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-alliance-blue" />
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
          <Tabs defaultValue="all" className="w-full">
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
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50">
                        <div className="font-medium">Server outage in Toronto office</div>
                        <div className="hidden md:block text-sm text-muted-foreground">Jane Doe</div>
                        <div className="hidden md:block text-sm text-muted-foreground">Tech Team</div>
                        <div className="hidden md:block">
                          <Badge className="bg-[hsl(var(--priority-critical))] text-primary-foreground">Critical</Badge>
                        </div>
                        <div>
                          <Badge className="bg-[hsl(var(--status-open))] text-primary-foreground">Open</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50">
                        <div className="font-medium">VPN access for new employee</div>
                        <div className="hidden md:block text-sm text-muted-foreground">HR Department</div>
                        <div className="hidden md:block text-sm text-muted-foreground">John Smith</div>
                        <div className="hidden md:block">
                          <Badge className="bg-[hsl(var(--priority-high))] text-primary-foreground">High</Badge>
                        </div>
                        <div>
                          <Badge className="bg-[hsl(var(--status-onhold))] text-primary-foreground">On Hold</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50">
                        <div className="font-medium">Shared drive access request</div>
                        <div className="hidden md:block text-sm text-muted-foreground">Marketing Team</div>
                        <div className="hidden md:block text-sm text-muted-foreground">Unassigned</div>
                        <div className="hidden md:block">
                          <Badge className="bg-[hsl(var(--priority-medium))] text-primary-foreground">Medium</Badge>
                        </div>
                        <div>
                          <Badge className="bg-[hsl(var(--status-open))] text-primary-foreground">Open</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px_150px] items-center p-4 hover:bg-muted/50">
                        <div className="font-medium">Software license renewal</div>
                        <div className="hidden md:block text-sm text-muted-foreground">Finance Dept</div>
                        <div className="hidden md:block text-sm text-muted-foreground">Admin Team</div>
                        <div className="hidden md:block">
                          <Badge className="bg-[hsl(var(--priority-low))] text-primary-foreground">Low</Badge>
                        </div>
                        <div>
                          <Badge className="bg-[hsl(var(--status-resolved))] text-primary-foreground">Resolved</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="critical">
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  Showing critical tickets only
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="unassigned">
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  Showing unassigned tickets only
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="overdue">
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  Showing overdue tickets only
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

