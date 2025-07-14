"use client"

// CHANGE 1: Import useCallback
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiService } from "@/services/api"
import type { User } from "@/types"
import { Users, DollarSign, Loader2, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdminDashboard() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // CHANGE 2: Wrap loadUsers in useCallback to give it a stable identity.
  // We list `toast` as a dependency because it's a stable function from a hook.
  const loadUsers = useCallback(async () => {
    try {
      const data = await apiService.getUsers()
      setUsers(data.filter((u) => u.role === "user"))
    } catch {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadUsers()
  }, [loadUsers]) // CHANGE 3: Add `loadUsers` to the dependency array.

  const handleInitiateToggle = (user: User) => {
    setSelectedUser(user)
    setIsAlertOpen(true)
  }

  const handleConfirmToggle = async () => {
    if (!selectedUser) return

    setToggleLoading(selectedUser.id)
    try {
      const updatedUser = await apiService.toggleUserStatus(selectedUser.id)
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)))
      toast({
        title: "Success",
        description: `User ${updatedUser.isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    } finally {
      setToggleLoading(null)
      setSelectedUser(null) // This line was missing, added it to ensure state is reset
      setIsAlertOpen(false) // This line was also missing, ensures the dialog closes
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount)
  }

  const totalPayments = users.reduce((sum, user) => sum + (user.walletBalance || 0), 0)
  const activeUsers = users.filter((u) => u.isActive).length

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)

    if (filterStatus === "all") {
      return matchesSearch
    } else {
      const matchesFilter = filterStatus === "active" ? user.isActive : !user.isActive
      return matchesSearch && matchesFilter
    }
  })

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayments)}</div>
            <p className="text-xs text-muted-foreground">Combined user balances</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {/* --- SEARCH AND FILTER CONTROLS --- */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7dc400" }} />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-wrap items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(user.walletBalance || 0)}</p>
                      <p className="text-sm text-muted-foreground">Wallet Balance</p>
                    </div>
                    <div className="flex items-center space-x-2 ">
                      <Badge
                        className={
                          user.isActive
                            ? "bg-[#7dc400] hover:bg-[#7dc400]/90 text-white"
                            : "bg-secondary text-secondary-foreground"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {toggleLoading === user.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#7dc400" }} />
                      ) : (
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => handleInitiateToggle(user)}
                          disabled={toggleLoading === user.id}
                          aria-label={`Toggle user ${user.name} status`}
                          className="data-[state=checked]:bg-[#7dc400] data-[state=unchecked]:bg-red-600"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isAlertOpen}
        onOpenChange={(isOpen) => {
          if (toggleLoading) return
          setIsAlertOpen(isOpen)
          if (!isOpen) {
            setSelectedUser(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to{" "}
              <span className="font-bold">{selectedUser?.isActive ? "deactivate" : "activate"}</span> the user{" "}
              <span className="font-bold">{selectedUser?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggle}
              style={{
                backgroundColor: selectedUser?.isActive ? "#ef4444" : "#7dc400",
                color: "#fff",
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}