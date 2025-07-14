import type { User, Transaction, SystemStats } from "@/types"
import { mockUsers, mockTransactions, mockSystemStats } from "./mockData"

class ApiService {
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  async getUsers(): Promise<User[]> {
    await this.delay(800)
    return [...mockUsers]
  }

  async toggleUserStatus(userId: string): Promise<User> {
    await this.delay(500)
    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      mockUsers[userIndex].isActive = !mockUsers[userIndex].isActive
      return { ...mockUsers[userIndex] }
    }
    throw new Error("User not found")
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    await this.delay(600)
    return mockTransactions.filter((t) => t.userId === userId)
  }

  async createTransaction(userId: string, amount: number, description: string): Promise<Transaction> {
    await this.delay(1000)

    // Find the user and update their balance
    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Check if user has sufficient balance
    const currentBalance = mockUsers[userIndex].walletBalance || 0
    if (currentBalance < amount) {
      throw new Error("Insufficient balance")
    }

    // Deduct amount from user's wallet
    mockUsers[userIndex].walletBalance = currentBalance - amount

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId,
      amount,
      type: "debit",
      description,
      status: "completed",
      createdAt: new Date().toISOString(),
    }
    mockTransactions.unshift(newTransaction)
    return newTransaction
  }

  async getSystemStats(): Promise<SystemStats> {
    await this.delay(700)
    return { ...mockSystemStats }
  }

  async addAdmin(name: string, email: string): Promise<User> {
    await this.delay(800)
    const newAdmin: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "admin",
      isActive: true,
      walletBalance: 0,
    }
    mockUsers.push(newAdmin)
    return newAdmin
  }

  async removeAdmin(userId: string): Promise<boolean> {
    await this.delay(600)
    const userIndex = mockUsers.findIndex((u) => u.id === userId && u.role === "admin")
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1)
      return true
    }
    return false
  }

  async getUser(userId: string): Promise<User | null> {
    await this.delay(300)
    const user = mockUsers.find((u) => u.id === userId)
    return user ? { ...user } : null
  }
}

export const apiService = new ApiService()
