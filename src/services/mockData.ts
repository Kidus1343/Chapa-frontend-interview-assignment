
import type { User, Transaction, SystemStats } from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Kidus Messele",
    email: "user@chapa.co",
    role: "user",
    isActive: true,
    walletBalance: 15750.5,
  },
  {
    id: "2",
    name: "Abiy Girma",
    email: "admin@chapa.co",
    role: "admin",
    isActive: true,
    walletBalance: 5000.0,
  },
  {
    id: "3",
    name: "Ewnetu Ayalew",
    email: "superadmin@chapa.co",
    role: "super-admin",
    isActive: true,
    walletBalance: 25000.0,
  },
  {
    id: "4",
    name: "Sarah Girma",
    email: "sarah@example.com",
    role: "user",
    isActive: true,
    walletBalance: 8500.25,
  },
  {
    id: "5",
    name: "Dawit Jerbos",
    email: "david@example.com",
    role: "user",
    isActive: false,
    walletBalance: 2300.75,
  },
  {
    id: "6",
    name: "Hiwot Tesfaye",
    email: "hiwot@chapa.co",
    role: "user",
    isActive: true,
    walletBalance: 32050.0,
  },
  {
    id: "7",
    name: "Bereket Wolde",
    email: "bereket@chapa.co",
    role: "user",
    isActive: true,
    walletBalance: 7300.6,
  },
  {
    id: "8",
    name: "Tigist Mekonnen",
    email: "tigist@chapa.co",
    role: "user",
    isActive: false,
    walletBalance: 890.0,
  },
  {
    id: "9",
    name: "Dawit Assefa",
    email: "dawit@chapa.co",
    role: "user",
    isActive: true,
    walletBalance: 15400.45,
  },
  {
    id: "10",
    name: "Sara Belay",
    email: "sara@chapa.co",
    role: "user",
    isActive: true,
    walletBalance: 6700.0,
  },

]

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    amount: 500.0,
    type: "credit",
    description: "Payment received from client",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "1",
    amount: 150.0,
    type: "debit",
    description: "Online purchase",
    status: "completed",
    createdAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    userId: "1",
    amount: 1000.0,
    type: "credit",
    description: "Salary deposit",
    status: "completed",
    createdAt: "2024-01-13T09:00:00Z",
  },
  {
    id: "4",
    userId: "4",
    amount: 250.0,
    type: "debit",
    description: "Utility payment",
    status: "pending",
    createdAt: "2024-01-15T14:20:00Z",
  },
]

export const mockSystemStats: SystemStats = {
  totalPayments: 125000.5,
  activeUsers: 1250,
  totalTransactions: 5420,
  totalRevenue: 8750.25,
}
