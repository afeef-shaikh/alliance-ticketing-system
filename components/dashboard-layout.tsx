"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { useToast } from "@/hooks/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "user" | "admin"
}

interface Notification {
  id: string
  title: string
  time: Date
  read: boolean
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  // Improve notification system
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "T-1234",
      title: "Ticket #1234 Updated",
      time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      read: false,
    },
    {
      id: "T-5678",
      title: "Ticket #5678 Resolved",
      time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      read: false,
    },
    {
      id: "T-9012",
      title: "New comment on Ticket #9012",
      time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      read: false,
    },
  ])

  // Add notification listeners for various events
  useEffect(() => {
    // Ticket events
    const handleNewTicket = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; title: string }>
      const newNotification = {
        id: customEvent.detail.id,
        title: `New ticket created: ${customEvent.detail.title}`,
        time: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])

      // Show toast notification
      toast({
        title: "New Ticket",
        description: `Ticket ${customEvent.detail.id} has been created.`,
      })
    }

    const handleTicketUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; status: string }>
      const newNotification = {
        id: customEvent.detail.id,
        title: `Ticket ${customEvent.detail.id} status changed to ${customEvent.detail.status}`,
        time: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])

      // Show toast notification
      toast({
        title: "Ticket Updated",
        description: `Ticket ${customEvent.detail.id} status changed to ${customEvent.detail.status}.`,
      })
    }

    const handleTicketAssigned = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; assignee: string }>
      const newNotification = {
        id: customEvent.detail.id,
        title: `Ticket ${customEvent.detail.id} assigned to ${customEvent.detail.assignee}`,
        time: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])

      // Show toast notification
      toast({
        title: "Ticket Assigned",
        description: `Ticket ${customEvent.detail.id} assigned to ${customEvent.detail.assignee}.`,
      })
    }

    // User events
    const handleUserAdded = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; name: string; action: string }>
      const newNotification = {
        id: customEvent.detail.id,
        title: `New user added: ${customEvent.detail.name}`,
        time: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])

      // Show toast notification
      toast({
        title: "User Added",
        description: `${customEvent.detail.name} has been added to the system.`,
      })
    }

    const handleUserUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; name: string; action: string }>
      const newNotification = {
        id: customEvent.detail.id,
        title: `User ${customEvent.detail.name} has been ${customEvent.detail.action}`,
        time: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
    }

    const handlePasswordReset = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; name: string; action: string }>
      const newNotification = {
        id: customEvent.detail.id,
        title: `Password reset for ${customEvent.detail.name}`,
        time: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
    }

    const handleUserStatusChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; name: string; action: string }>
      const newNotification = {
        id: customEvent.detail.id,
        title: `User ${customEvent.detail.name} has been ${customEvent.detail.action}`,
        time: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
    }

    // Add event listeners
    window.addEventListener("newTicketCreated", handleNewTicket)
    window.addEventListener("ticketUpdated", handleTicketUpdated)
    window.addEventListener("ticketAssigned", handleTicketAssigned)
    window.addEventListener("userAdded", handleUserAdded)
    window.addEventListener("userUpdated", handleUserUpdated)
    window.addEventListener("passwordReset", handlePasswordReset)
    window.addEventListener("userStatusChanged", handleUserStatusChanged)

    return () => {
      // Remove event listeners
      window.removeEventListener("newTicketCreated", handleNewTicket)
      window.removeEventListener("ticketUpdated", handleTicketUpdated)
      window.removeEventListener("ticketAssigned", handleTicketAssigned)
      window.removeEventListener("userAdded", handleUserAdded)
      window.removeEventListener("userUpdated", handleUserUpdated)
      window.removeEventListener("passwordReset", handlePasswordReset)
      window.removeEventListener("userStatusChanged", handleUserStatusChanged)
    }
  }, [toast])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const userNavItems = [
    { name: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "All My Tickets", href: "/dashboard/user/tickets", icon: ClipboardList },
    { name: "New Ticket", href: "/dashboard/user/tickets/new", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/user/settings", icon: Settings },
  ]

  const adminNavItems = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "All Tickets", href: "/dashboard/admin/tickets", icon: ClipboardList },
    { name: "Analytics", href: "/dashboard/admin/analytics", icon: PieChart },
    { name: "Users", href: "/dashboard/admin/users", icon: User },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ]

  const navItems = userType === "user" ? userNavItems : adminNavItems

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IPAyiCPV1mjcd85R82bE9xu3MsnXZe.png"
              alt="Alliance for Healthier Communities Logo"
              width={32}
              height={32}
            />
            <span className="hidden font-semibold md:inline-block">Alliance IT Support</span>
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-alliance-red text-white">
                    {notifications.filter((n) => !n.read).length}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {notifications.filter((n) => !n.read).length} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id + notification.time.getTime()} className="cursor-pointer">
                      <div className="flex flex-col gap-1 py-1 w-full">
                        <div className="flex items-start justify-between">
                          <span className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </span>
                          {!notification.read && <Badge className="ml-2 h-2 w-2 rounded-full p-0 bg-alliance-red" />}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationTime(notification.time)}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="py-3 px-2 text-center text-muted-foreground text-sm">No notifications</div>
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center cursor-pointer" onClick={markAllAsRead}>
                    <span className="text-xs">Mark all as read</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-alliance-green text-primary-foreground">
                    {userType === "user" ? "JD" : "AT"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userType === "user" ? "Jane Doe" : "Admin Tech"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IPAyiCPV1mjcd85R82bE9xu3MsnXZe.png"
                alt="Alliance for Healthier Communities Logo"
                width={32}
                height={32}
              />
              <span className="font-semibold">Alliance IT Support</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

// Helper function for formatting notification time
const formatNotificationTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
}

