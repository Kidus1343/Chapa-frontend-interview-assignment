export type UserRole = "user" | "admin" | "super-admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  walletBalance?: number
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: "credit" | "debit"
  description: string
  status: "completed" | "pending" | "failed"
  createdAt: string
}

export interface SystemStats {
  totalPayments: number
  activeUsers: number
  totalTransactions: number
  totalRevenue: number
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => void
  isLoading: boolean
}
