"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Login } from "@/components/Login"
import { Header } from "@/components/Header"
import { Dashboard } from "@/components/Dashboard"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#7dc400" }}/>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Dashboard />
    </div>
  )
}
