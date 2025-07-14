"use client"

// CHANGE 1: Import `useCallback` from React
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import type { User, SystemStats } from "@/types"
import { Users, DollarSign, Activity, TrendingUp, Loader2, UserPlus, UserMinus, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdminDashboard } from "./AdminDashboard"

export function SuperAdminDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [admins, setAdmins] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [adminForm, setAdminForm] = useState({ name: "", email: "" })
  const [submitting, setSubmitting] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null)

  // CHANGE 2: Wrap `loadData` in `useCallback` to give it a stable reference
  const loadData = useCallback(async () => {
    try {
      const [statsData, usersData] = await Promise.all([apiService.getSystemStats(), apiService.getUsers()])
      setStats(statsData)
      setAdmins(usersData.filter((u) => u.role === "admin"))
    } catch {
      toast({
        title: "Error",
        description: "Failed to load system data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast]) // `toast` is a dependency from an external hook

  useEffect(() => {
    loadData()
  }, [loadData]) // CHANGE 3: Add the memoized `loadData` to the dependency array

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newAdmin = await apiService.addAdmin(adminForm.name, adminForm.email)
      setAdmins((prev) => [...prev, newAdmin])
      setAdminForm({ name: "", email: "" })
      toast({
        title: "Success",
        description: "Admin added successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to add admin",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInitiateRemove = (admin: User) => {
    setSelectedAdmin(admin)
    setIsAlertOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (!selectedAdmin) return

    setRemoving(selectedAdmin.id)
    try {
      await apiService.removeAdmin(selectedAdmin.id)
      setAdmins((prev) => prev.filter((a) => a.id !== selectedAdmin.id))
      toast({
        title: "Success",
        description: "Admin removed successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove admin",
        variant: "destructive",
      })
    } finally {
      setRemoving(null)
      setSelectedAdmin(null)
      setIsAlertOpen(false) // BUG FIX: Ensure the dialog closes after the action
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? formatCurrency(stats.totalPayments) : "..."}</div>
            <p className="text-xs text-muted-foreground">System-wide payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || "..."}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions || "..."}</div>
            <p className="text-xs text-muted-foreground">All-time transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? formatCurrency(stats.totalRevenue) : "..."}</div>
            <p className="text-xs text-muted-foreground">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Management */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Admin</CardTitle>
            <CardDescription>Create a new admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Admin name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" style={{ backgroundColor: "#7dc400", color: "#fff" }} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Admins</CardTitle>
            <CardDescription>Manage existing admin accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin " style={{ color: "#7dc400" }}/>
              </div>
            ) : admins.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No admins found</p>
            ) : (
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                      <Badge variant="secondary">Admin</Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleInitiateRemove(admin)}
                      disabled={removing === admin.id}
                    >
                      {removing === admin.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Include Admin Dashboard Features */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">User Management</h2>
        <AdminDashboard />
      </div>

      {/* Confirmation Dialog for Removing Admin */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{" "}
              <span className="font-bold">{selectedAdmin?.name}</span> as an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAdmin(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-red-600 text-white hover:bg-red-700">
              Confirm & Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}