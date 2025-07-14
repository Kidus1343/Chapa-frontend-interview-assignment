// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// import type { User, AuthContextType } from "@/types"
// import { mockUsers } from "@/services/mockData"

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Check if user is already logged in (from localStorage)
//     const savedUser = localStorage.getItem("chapa-user")
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//     setIsLoading(false)
//   }, [])

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     const foundUser = mockUsers.find((u) => u.email === email)

//     if (foundUser && password === "password123") {
//       setUser(foundUser)
//       localStorage.setItem("chapa-user", JSON.stringify(foundUser))
//       setIsLoading(false)
//       return true
//     }

//     setIsLoading(false)
//     return false
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("chapa-user")
//   }

//   const updateUser = (updatedUser: User) => {
//     setUser(updatedUser)
//     localStorage.setItem("chapa-user", JSON.stringify(updatedUser))
//   }

//   return <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// import type { User, AuthContextType } from "@/types"
// import { mockUsers } from "@/services/mockData" // Ensure this path is correct for your project

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)


//   useEffect(() => {
//     // This effect runs on the client-side to rehydrate the user state
//     // from localStorage, persisting the session across page reloads.
//     const savedUser = localStorage.getItem("chapa-user")
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//     setIsLoading(false)
//   }, [])

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true)
//     // Simulate an API call delay
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // Find user by email (case-insensitive for better UX)
//     const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

//     // CRITICAL: Check if user exists AND password matches
//     if (foundUser && password === "password123") {
//       setUser(foundUser)
//       localStorage.setItem("chapa-user", JSON.stringify(foundUser))
//       setIsLoading(false)

//       return true // Signal that login was successful
//     }

//     // If no user is found or the password is wrong, signal failure.
//     setIsLoading(false)
//     return false
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("chapa-user")
   
//   }

//   // This function is useful for updating user data (e.g., after a profile edit)
//   const updateUser = (updatedUser: User) => {
//     setUser(updatedUser)
//     localStorage.setItem("chapa-user", JSON.stringify(updatedUser))
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "@/types"
import { mockUsers } from "@/services/mockData"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("chapa-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Don't set global loading state during login
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)

    // Check if user exists AND password is correct
    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("chapa-user", JSON.stringify(foundUser))
      return true
    }

    // Return false for any invalid credentials (wrong email OR wrong password)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("chapa-user")
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("chapa-user", JSON.stringify(updatedUser))
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
