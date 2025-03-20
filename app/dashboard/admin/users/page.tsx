"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, UserPlus, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add these imports for user management dialogs
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Define user type
interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: "active" | "inactive"
  lastActive: string
  ticketsCreated: number
  ticketsResolved?: number
  avatar?: string
}

// Sample user data
const sampleUsers: User[] = [
  {
    id: "U-1001",
    name: "Jane Doe",
    email: "jane.doe@alliance.org",
    department: "Operations",
    role: "User",
    status: "active",
    lastActive: "2025-03-18T10:30:00",
    ticketsCreated: 12,
    avatar: "",
  },
  {
    id: "U-1002",
    name: "John Smith",
    email: "john.smith@alliance.org",
    department: "IT Support",
    role: "Admin",
    status: "active",
    lastActive: "2025-03-18T09:45:00",
    ticketsCreated: 5,
    ticketsResolved: 48,
    avatar: "",
  },
  {
    id: "U-1003",
    name: "Emily Johnson",
    email: "emily.johnson@alliance.org",
    department: "Human Resources",
    role: "User",
    status: "active",
    lastActive: "2025-03-17T14:20:00",
    ticketsCreated: 8,
    avatar: "",
  },
  {
    id: "U-1004",
    name: "Michael Brown",
    email: "michael.brown@alliance.org",
    department: "Finance",
    role: "User",
    status: "inactive",
    lastActive: "2025-03-10T11:15:00",
    ticketsCreated: 3,
    avatar: "",
  },
  {
    id: "U-1005",
    name: "Sarah Wilson",
    email: "sarah.wilson@alliance.org",
    department: "Marketing",
    role: "User",
    status: "active",
    lastActive: "2025-03-18T08:30:00",
    ticketsCreated: 6,
    avatar: "",
  },
  {
    id: "U-1006",
    name: "David Lee",
    email: "david.lee@alliance.org",
    department: "IT Support",
    role: "Admin",
    status: "active",
    lastActive: "2025-03-18T11:45:00",
    ticketsCreated: 3,
    ticketsResolved: 32,
    avatar: "",
  },
  {
    id: "U-1007",
    name: "Lisa Chen",
    email: "lisa.chen@alliance.org",
    department: "Operations",
    role: "User",
    status: "active",
    lastActive: "2025-03-17T16:20:00",
    ticketsCreated: 9,
    avatar: "",
  },
  {
    id: "U-1008",
    name: "Robert Taylor",
    email: "robert.taylor@alliance.org",
    department: "Executive",
    role: "User",
    status: "active",
    lastActive: "2025-03-16T09:10:00",
    ticketsCreated: 4,
    avatar: "",
  },
  {
    id: "U-1009",
    name: "Amanda Garcia",
    email: "amanda.garcia@alliance.org",
    department: "Marketing",
    role: "User",
    status: "active",
    lastActive: "2025-03-18T13:15:00",
    ticketsCreated: 7,
    avatar: "",
  },
  {
    id: "U-1010",
    name: "Kevin Wong",
    email: "kevin.wong@alliance.org",
    department: "Finance",
    role: "User",
    status: "active",
    lastActive: "2025-03-17T10:45:00",
    ticketsCreated: 5,
    avatar: "",
  },
  {
    id: "U-1011",
    name: "Michelle Park",
    email: "michelle.park@alliance.org",
    department: "Human Resources",
    role: "User",
    status: "active",
    lastActive: "2025-03-18T09:20:00",
    ticketsCreated: 4,
    avatar: "",
  },
  {
    id: "U-1012",
    name: "Thomas Rodriguez",
    email: "thomas.rodriguez@alliance.org",
    department: "IT Support",
    role: "Admin",
    status: "active",
    lastActive: "2025-03-18T14:30:00",
    ticketsCreated: 2,
    ticketsResolved: 28,
    avatar: "",
  },
  {
    id: "U-1013",
    name: "Jennifer Kim",
    email: "jennifer.kim@alliance.org",
    department: "Operations",
    role: "User",
    status: "inactive",
    lastActive: "2025-03-12T11:10:00",
    ticketsCreated: 10,
    avatar: "",
  },
  {
    id: "U-1014",
    name: "Daniel Martinez",
    email: "daniel.martinez@alliance.org",
    department: "Executive",
    role: "User",
    status: "active",
    lastActive: "2025-03-17T15:40:00",
    ticketsCreated: 3,
    avatar: "",
  },
  {
    id: "U-1015",
    name: "Sophia Nguyen",
    email: "sophia.nguyen@alliance.org",
    department: "IT Support",
    role: "User",
    status: "active",
    lastActive: "2025-03-18T10:15:00",
    ticketsCreated: 6,
    avatar: "",
  },
  {
    id: "U-1016",
    name: "William Johnson",
    email: "william.johnson@alliance.org",
    department: "Operations",
    role: "User",
    status: "active",
    lastActive: "2025-03-17T09:30:00",
    ticketsCreated: 8,
    avatar: "",
  },
  {
    id: "U-1017",
    name: "Olivia Davis",
    email: "olivia.davis@alliance.org",
    department: "Marketing",
    role: "User",
    status: "active",
    lastActive: "2025-03-18T11:20:00",
    ticketsCreated: 5,
    avatar: "",
  },
  {
    id: "U-1018",
    name: "James Wilson",
    email: "james.wilson@alliance.org",
    department: "Finance",
    role: "User",
    status: "active",
    lastActive: "2025-03-16T14:45:00",
    ticketsCreated: 4,
    avatar: "",
  },
  {
    id: "U-1019",
    name: "Emma Thompson",
    email: "emma.thompson@alliance.org",
    department: "Human Resources",
    role: "User",
    status: "active",
    lastActive: "2025-03-17T13:10:00",
    ticketsCreated: 7,
    avatar: "",
  },
  {
    id: "U-1020",
    name: "Alexander Chen",
    email: "alexander.chen@alliance.org",
    department: "IT Support",
    role: "Admin",
    status: "active",
    lastActive: "2025-03-18T08:50:00",
    ticketsCreated: 3,
    ticketsResolved: 36,
    avatar: "",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()

  // Add these states for user management dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewProfileDialogOpen, setViewProfileDialogOpen] = useState(false)
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [deactivateUserDialogOpen, setDeactivateUserDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)

  // Form states for editing and adding users
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formDepartment, setFormDepartment] = useState("")
  const [formRole, setFormRole] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Load users on component mount
  useEffect(() => {
    // Use the expanded sample users list
    setUsers(sampleUsers)

    // Save to localStorage for consistency with other parts of the app
    localStorage.setItem("systemUsers", JSON.stringify(sampleUsers))
  }, [])

  // Filter users based on search and filters
  const getFilteredUsers = () => {
    let filteredUsers = [...users]

    // Apply search filter
    if (searchQuery) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.department === departmentFilter)
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === statusFilter)
    }

    return filteredUsers
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Add these functions for user management
  const handleViewProfile = (user: User) => {
    setSelectedUser(user)
    setViewProfileDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormDepartment(user.department)
    setFormRole(user.role)
    setEditUserDialogOpen(true)
  }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setNewPassword("")
    setConfirmPassword("")
    setResetPasswordDialogOpen(true)
  }

  const handleDeactivateUser = (user: User) => {
    setSelectedUser(user)
    setDeactivateUserDialogOpen(true)
  }

  const handleAddUser = () => {
    setFormName("")
    setFormEmail("")
    setFormDepartment("")
    setFormRole("User")
    setNewPassword("")
    setConfirmPassword("")
    setAddUserDialogOpen(true)
  }

  const saveEditedUser = () => {
    if (!selectedUser || !formName || !formEmail || !formDepartment || !formRole) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            name: formName,
            email: formEmail,
            department: formDepartment,
            role: formRole,
          }
        : user,
    )

    setUsers(updatedUsers)
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers))
    setEditUserDialogOpen(false)

    toast({
      title: "User Updated",
      description: `${formName}'s information has been updated.`,
    })

    // Trigger notification
    const notificationEvent = new CustomEvent("userUpdated", {
      detail: {
        id: selectedUser.id,
        name: formName,
        action: "updated",
      },
    })
    window.dispatchEvent(notificationEvent)
  }

  const saveNewUser = () => {
    if (!formName || !formEmail || !formDepartment || !formRole || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    const newUser: User = {
      id: `U-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formName,
      email: formEmail,
      department: formDepartment,
      role: formRole,
      status: "active",
      lastActive: new Date().toISOString(),
      ticketsCreated: 0,
      ticketsResolved: formRole === "Admin" ? 0 : undefined,
      avatar: "",
    }

    const updatedUsers = [newUser, ...users]
    setUsers(updatedUsers)
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers))
    setAddUserDialogOpen(false)

    toast({
      title: "User Added",
      description: `${formName} has been added to the system.`,
    })

    // Trigger notification
    const notificationEvent = new CustomEvent("userAdded", {
      detail: {
        id: newUser.id,
        name: formName,
        action: "added",
      },
    })
    window.dispatchEvent(notificationEvent)
  }

  const resetUserPassword = () => {
    if (!selectedUser || !newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setResetPasswordDialogOpen(false)

    toast({
      title: "Password Reset",
      description: `Password for ${selectedUser.name} has been reset.`,
    })

    // Trigger notification
    const notificationEvent = new CustomEvent("passwordReset", {
      detail: {
        id: selectedUser.id,
        name: selectedUser.name,
        action: "password reset",
      },
    })
    window.dispatchEvent(notificationEvent)
  }

  const toggleUserStatus = () => {
    if (!selectedUser) return

    const newStatus = selectedUser.status === "active" ? "inactive" : "active"
    const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...user, status: newStatus } : user))

    setUsers(updatedUsers)
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers))
    setDeactivateUserDialogOpen(false)

    toast({
      title: newStatus === "active" ? "User Activated" : "User Deactivated",
      description: `${selectedUser.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    })

    // Trigger notification
    const notificationEvent = new CustomEvent("userStatusChanged", {
      detail: {
        id: selectedUser.id,
        name: selectedUser.name,
        action: newStatus === "active" ? "activated" : "deactivated",
      },
    })
    window.dispatchEvent(notificationEvent)
  }

  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View and manage all users in the system</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
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
            <Button className="flex items-center gap-2" onClick={handleAddUser}>
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Filter Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="IT Support">IT Support</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredUsers().map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className={user.role === "Admin" ? "bg-alliance-blue" : "bg-alliance-green"}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Admin" ? "default" : "outline"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={
                          user.status === "active"
                            ? "bg-[hsl(var(--status-resolved))] text-primary-foreground"
                            : "bg-[hsl(var(--status-closed))] text-primary-foreground"
                        }
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.lastActive)}</TableCell>
                    <TableCell>
                      {user.role === "Admin" ? (
                        <div>
                          <div className="text-sm">Created: {user.ticketsCreated}</div>
                          <div className="text-sm">Resolved: {user.ticketsResolved}</div>
                        </div>
                      ) : (
                        <div>Created: {user.ticketsCreated}</div>
                      )}
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewProfile(user)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user)}>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={user.status === "active" ? "text-destructive" : "text-primary"}
                            onClick={() => handleDeactivateUser(user)}
                          >
                            {user.status === "active" ? "Deactivate User" : "Activate User"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {getFilteredUsers().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* View Profile Dialog */}
      <Dialog open={viewProfileDialogOpen} onOpenChange={setViewProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed information about this user</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback
                    className={selectedUser.role === "Admin" ? "bg-alliance-blue text-xl" : "bg-alliance-green text-xl"}
                  >
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">User ID</Label>
                  <div className="font-medium">{selectedUser.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Status</Label>
                  <div>
                    <Badge
                      variant={selectedUser.status === "active" ? "default" : "secondary"}
                      className={
                        selectedUser.status === "active"
                          ? "bg-[hsl(var(--status-resolved))] text-primary-foreground"
                          : "bg-[hsl(var(--status-closed))] text-primary-foreground"
                      }
                    >
                      {selectedUser.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Department</Label>
                  <div className="font-medium">{selectedUser.department}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Role</Label>
                  <div>
                    <Badge variant={selectedUser.role === "Admin" ? "default" : "outline"}>{selectedUser.role}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Last Active</Label>
                <div>{formatDate(selectedUser.lastActive)}</div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Ticket Statistics</Label>
                <div className="grid grid-cols-2 gap-4 bg-muted p-3 rounded-md">
                  <div>
                    <span className="text-muted-foreground text-sm">Created:</span>
                    <span className="font-medium ml-2">{selectedUser.ticketsCreated}</span>
                  </div>
                  {selectedUser.role === "Admin" && (
                    <div>
                      <span className="text-muted-foreground text-sm">Resolved:</span>
                      <span className="font-medium ml-2">{selectedUser.ticketsResolved}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewProfileDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select value={formDepartment} onValueChange={setFormDepartment}>
                  <SelectTrigger id="department" className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for this user</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">User</Label>
                <div className="font-medium">
                  {selectedUser.name} ({selectedUser.email})
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={resetUserPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate/Activate User Dialog */}
      <Dialog open={deactivateUserDialogOpen} onOpenChange={setDeactivateUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.status === "active" ? "Deactivate User" : "Activate User"}</DialogTitle>
            <DialogDescription>
              {selectedUser?.status === "active"
                ? "This will prevent the user from accessing the system."
                : "This will restore the user's access to the system."}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <p>
                Are you sure you want to {selectedUser.status === "active" ? "deactivate" : "activate"}{" "}
                {selectedUser.name}?
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={selectedUser?.status === "active" ? "destructive" : "default"} onClick={toggleUserStatus}>
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newName" className="text-right">
                Name
              </Label>
              <Input
                id="newName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newEmail" className="text-right">
                Email
              </Label>
              <Input
                id="newEmail"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newDepartment" className="text-right">
                Department
              </Label>
              <Select value={formDepartment} onValueChange={setFormDepartment}>
                <SelectTrigger id="newDepartment" className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="IT Support">IT Support</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newRole" className="text-right">
                Role
              </Label>
              <Select value={formRole} onValueChange={setFormRole}>
                <SelectTrigger id="newRole" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initialPassword" className="text-right">
                Password
              </Label>
              <Input
                id="initialPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmInitialPassword" className="text-right">
                Confirm
              </Label>
              <Input
                id="confirmInitialPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNewUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

