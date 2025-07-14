"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super-admin":
        return "bg-red-100 text-red-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super-admin":
        return "Super Admin"
      case "admin":
        return "Admin"
      default:
        return "User"
    }
  }

  return (
    <>
      {/* Header component */}
      <header className="bg-gradient-to-r from-[#71b60f] to-[#00a99d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              
              <h1 className="text-xl font-bold text-white">Chapa Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">{user?.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role || "")}`}>
                  {getRoleLabel(user?.role || "")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLogoutAlertOpen(true)}
                className="text-black border-black hover:bg-white hover:text-green-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login screen and will need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={logout}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}