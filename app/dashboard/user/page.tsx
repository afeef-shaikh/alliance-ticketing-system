import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Clock, Plus, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {
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
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">All tickets in the system</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-open)/0.15)] border-[hsl(var(--status-open))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-[hsl(var(--status-open))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">2 high priority</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-onhold)/0.15)] border-[hsl(var(--status-onhold))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-[hsl(var(--status-onhold))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">1 awaiting your response</p>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--status-resolved)/0.15)] border-[hsl(var(--status-resolved))]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--status-resolved))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
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
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50">
                      <div className="font-medium">Network connectivity issues</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 15, 2025</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 16, 2025</div>
                      <div className="hidden lg:block">
                        <Badge className="bg-[hsl(var(--priority-high))] text-primary-foreground">High</Badge>
                      </div>
                      <div>
                        <Badge className="bg-[hsl(var(--status-open))] text-primary-foreground">Open</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50">
                      <div className="font-medium">Software installation request</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 12, 2025</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 14, 2025</div>
                      <div className="hidden lg:block">
                        <Badge className="bg-[hsl(var(--priority-medium))] text-primary-foreground">Medium</Badge>
                      </div>
                      <div>
                        <Badge className="bg-[hsl(var(--status-onhold))] text-primary-foreground">On Hold</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50">
                      <div className="font-medium">Email access problem</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 10, 2025</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 13, 2025</div>
                      <div className="hidden lg:block">
                        <Badge className="bg-[hsl(var(--priority-critical))] text-primary-foreground">Critical</Badge>
                      </div>
                      <div>
                        <Badge className="bg-[hsl(var(--status-resolved))] text-primary-foreground">Resolved</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] lg:grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-muted/50">
                      <div className="font-medium">Printer not working</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 8, 2025</div>
                      <div className="hidden md:block text-sm text-muted-foreground">Mar 9, 2025</div>
                      <div className="hidden lg:block">
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
          <TabsContent value="open">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">Showing open tickets only</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inprogress">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                Showing in-progress tickets only
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resolved">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">Showing resolved tickets only</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

