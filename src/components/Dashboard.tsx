"use client"

import { useAuth } from "@/contexts/AuthContext"
import { UserDashboard } from "./dashboards/UserDashboard"
import { AdminDashboard } from "./dashboards/AdminDashboard"
import { SuperAdminDashboard } from "./dashboards/SuperAdminDashboard"

export function Dashboard() {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case "user":
        return <UserDashboard />
      case "admin":
        return <AdminDashboard />
      case "super-admin":
        return <SuperAdminDashboard />
      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Heres whats happening with your account today.</p>
      </div>
      {renderDashboard()}
    </div>
  )
}
