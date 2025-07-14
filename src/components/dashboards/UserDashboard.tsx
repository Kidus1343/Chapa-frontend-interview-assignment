// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { useAuth } from "@/contexts/AuthContext"
// import { apiService } from "@/services/api"
// import type { Transaction } from "@/types"
// import { Wallet, ArrowUpRight, ArrowDownLeft, Loader2, Send } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// export function UserDashboard() {
//   const { user } = useAuth()
//   const { toast } = useToast()
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [loading, setLoading] = useState(true)
//   const [transactionForm, setTransactionForm] = useState({
//     amount: "",
//     description: "",
//   })
//   const [submitting, setSubmitting] = useState(false)
//   const [currentBalance, setCurrentBalance] = useState(user?.walletBalance || 0)
//   const [isAlertOpen, setIsAlertOpen] = useState(false) // State for the dialog

//   useEffect(() => {
//     setCurrentBalance(user?.walletBalance || 0)
//     loadTransactions()
//   }, [user])

//   const loadTransactions = async () => {
//     if (!user) return
//     try {
//       const data = await apiService.getUserTransactions(user.id)
//       setTransactions(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load transactions",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   // This function now just opens the confirmation dialog
//   const handleInitiateTransaction = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user) return

//     const amount = Number.parseFloat(transactionForm.amount)

//     if (amount <= 0 || !transactionForm.description) {
//       toast({
//         title: "Invalid Input",
//         description: "Please enter a valid amount and description.",
//         variant: "destructive",
//       })
//       return
//     }

//     if (amount > currentBalance) {
//       toast({
//         title: "Error",
//         description: "Insufficient balance for this transaction",
//         variant: "destructive",
//       })
//       return
//     }

//     // Open the confirmation dialog
//     setIsAlertOpen(true)
//   }

//   // This function handles the actual submission after confirmation
//   const handleConfirmTransaction = async () => {
//     if (!user) return
//     setSubmitting(true)

//     try {
//       const amount = Number.parseFloat(transactionForm.amount)
//       await apiService.createTransaction(user.id, amount, transactionForm.description)

//       setCurrentBalance((prev) => prev - amount)

//       toast({
//         title: "Success",
//         description: "Transaction completed successfully",
//       })

//       setTransactionForm({ amount: "", description: "" })
//       loadTransactions()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to process transaction",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "ETB",
//     }).format(amount)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Wallet Balance */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
//             <Wallet className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
//             <p className="text-xs text-muted-foreground">Available balance</p>
//           </CardContent>
//         </Card>

//         {/* Transaction Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">Send Money</CardTitle>
//             <CardDescription>Initiate a new transaction</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* The form now calls handleInitiateTransaction */}
//             <form onSubmit={handleInitiateTransaction} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="amount">Amount</Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   step="0.01"
//                   value={transactionForm.amount}
//                   onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
//                   placeholder="0.00"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Input
//                   id="description"
//                   value={transactionForm.description}
//                   onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Payment description"
//                   required
//                 />
//               </div>
//               <Button type="submit" style={{ backgroundColor: "#7dc400", color: "#fff" }} className="w-full" disabled={submitting}>
//                 {submitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" style={{ color: "#7dc400" }} />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="mr-2 h-4 w-4" />
//                     Send Money
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Transactions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Transactions</CardTitle>
//           <CardDescription>Your latest payment activities</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7dc400" }}/>
//             </div>
//           ) : transactions.length === 0 ? (
//             <p className="text-center text-muted-foreground py-8">No transactions found</p>
//           ) : (
//             <div className="space-y-4">
//               {transactions.map((transaction) => (
//                 <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
//                     >
//                       {transaction.type === "credit" ? (
//                         <ArrowDownLeft className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <ArrowUpRight className="h-4 w-4 text-red-600" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-medium">{transaction.description}</p>
//                       <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
//                       {transaction.type === "credit" ? "+" : "-"}
//                       {formatCurrency(transaction.amount)}
//                     </p>
//                     <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
//                       {transaction.status}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Confirmation Dialog */}
//       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to send{" "}
//               <span className="font-bold">{formatCurrency(Number.parseFloat(transactionForm.amount) || 0)}</span> for "{transactionForm.description}"? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleConfirmTransaction}
//               style={{ backgroundColor: "#7dc400", color: "#fff" }}
//             >
//               Confirm & Send
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }


// "use client"

// // CHANGE 1: Import `useCallback`
// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { useAuth } from "@/contexts/AuthContext"
// import { apiService } from "@/services/api"
// import type { Transaction } from "@/types"
// import { Wallet, ArrowUpRight, ArrowDownLeft, Loader2, Send } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// export function UserDashboard() {
//   const { user } = useAuth()
//   const { toast } = useToast()
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [loading, setLoading] = useState(true)
//   const [transactionForm, setTransactionForm] = useState({
//     amount: "",
//     description: "",
//   })
//   const [submitting, setSubmitting] = useState(false)
//   const [currentBalance, setCurrentBalance] = useState(user?.walletBalance || 0)
//   const [isAlertOpen, setIsAlertOpen] = useState(false)

//   // CHANGE 2: Wrap `loadTransactions` in `useCallback`
//   const loadTransactions = useCallback(async () => {
//     if (!user) return
//     try {
//       const data = await apiService.getUserTransactions(user.id)
//       setTransactions(data)
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to load transactions",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }, [user, toast]) // Dependencies for useCallback

//   useEffect(() => {
//     setCurrentBalance(user?.walletBalance || 0)
//     loadTransactions()
//   }, [user, loadTransactions]) // CHANGE 3: Add `loadTransactions` to the dependency array

//   const handleInitiateTransaction = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user) return

//     const amount = Number.parseFloat(transactionForm.amount)

//     if (amount <= 0 || !transactionForm.description) {
//       toast({
//         title: "Invalid Input",
//         description: "Please enter a valid amount and description.",
//         variant: "destructive",
//       })
//       return
//     }

//     if (amount > currentBalance) {
//       toast({
//         title: "Error",
//         description: "Insufficient balance for this transaction",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsAlertOpen(true)
//   }

//   const handleConfirmTransaction = async () => {
//     if (!user) return
//     setSubmitting(true)

//     try {
//       const amount = Number.parseFloat(transactionForm.amount)
//       await apiService.createTransaction(user.id, amount, transactionForm.description)

//       setCurrentBalance((prev) => prev - amount)

//       toast({
//         title: "Success",
//         description: "Transaction completed successfully",
//       })

//       setTransactionForm({ amount: "", description: "" })
//       loadTransactions()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to process transaction",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmitting(false)
//       setIsAlertOpen(false) // BUG FIX: Close the dialog after the transaction is processed
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "ETB",
//     }).format(amount)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Wallet Balance */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
//             <Wallet className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
//             <p className="text-xs text-muted-foreground">Available balance</p>
//           </CardContent>
//         </Card>

//         {/* Transaction Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">Send Money</CardTitle>
//             <CardDescription>Initiate a new transaction</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleInitiateTransaction} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="amount">Amount</Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   step="0.01"
//                   value={transactionForm.amount}
//                   onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
//                   placeholder="0.00"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Input
//                   id="description"
//                   value={transactionForm.description}
//                   onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Payment description"
//                   required
//                 />
//               </div>
//               <Button type="submit" style={{ backgroundColor: "#7dc400", color: "#fff" }} className="w-full" disabled={submitting}>
//                 {submitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="mr-2 h-4 w-4" />
//                     Send Money
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Transactions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Transactions</CardTitle>
//           <CardDescription>Your latest payment activities</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7dc400" }}/>
//             </div>
//           ) : transactions.length === 0 ? (
//             <p className="text-center text-muted-foreground py-8">No transactions found</p>
//           ) : (
//             <div className="space-y-4">
//               {transactions.map((transaction) => (
//                 <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
//                     >
//                       {transaction.type === "credit" ? (
//                         <ArrowDownLeft className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <ArrowUpRight className="h-4 w-4 text-red-600" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-medium">{transaction.description}</p>
//                       <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
//                       {transaction.type === "credit" ? "+" : "-"}
//                       {formatCurrency(transaction.amount)}
//                     </p>
//                     <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
//                       {transaction.status}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Confirmation Dialog */}
//       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
//             <AlertDialogDescription>
//               {/* CHANGE 5: Replace literal quotes with `"` */}
//               Are you sure you want to send{" "}
//               <span className="font-bold">{formatCurrency(Number.parseFloat(transactionForm.amount) || 0)}</span> for "{transactionForm.description}"? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleConfirmTransaction}
//               style={{ backgroundColor: "#7dc400", color: "#fff" }}
//             >
//               Confirm & Send
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }

"use client"

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
import { useAuth } from "@/contexts/AuthContext"
import { apiService } from "@/services/api"
import type { Transaction } from "@/types"
import { Wallet, ArrowUpRight, ArrowDownLeft, Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UserDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(user?.walletBalance || 0)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const loadTransactions = useCallback(async () => {
    if (!user) return
    try {
      const data = await apiService.getUserTransactions(user.id)
      setTransactions(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    setCurrentBalance(user?.walletBalance || 0)
    loadTransactions()
  }, [user, loadTransactions])

  const handleInitiateTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const amount = Number.parseFloat(transactionForm.amount)

    if (amount <= 0 || !transactionForm.description) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount and description.",
        variant: "destructive",
      })
      return
    }

    if (amount > currentBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance for this transaction",
        variant: "destructive",
      })
      return
    }

    setIsAlertOpen(true)
  }

  const handleConfirmTransaction = async () => {
    if (!user) return
    setSubmitting(true)

    try {
      const amount = Number.parseFloat(transactionForm.amount)
      await apiService.createTransaction(user.id, amount, transactionForm.description)

      setCurrentBalance((prev) => prev - amount)

      toast({
        title: "Success",
        description: "Transaction completed successfully",
      })

      setTransactionForm({ amount: "", description: "" })
      loadTransactions()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process transaction",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
      setIsAlertOpen(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Wallet Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </CardContent>
        </Card>

        {/* Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Send Money</CardTitle>
            <CardDescription>Initiate a new transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInitiateTransaction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Recipient Details</Label>
                <Input
                  id="description"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Recipient Details"
                  required
                />
              </div>
              <Button type="submit" style={{ backgroundColor: "#7dc400", color: "#fff" }} className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Money
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest payment activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7dc400" }}/>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send{" "}
              <span className="font-bold">
                {formatCurrency(
                  isNaN(parseFloat(transactionForm.amount))
                    ? 0
                    : parseFloat(transactionForm.amount)
                )}
              </span>{" "}
              for “{transactionForm.description || ''}”? This action cannot be undone.
            </AlertDialogDescription>

          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmTransaction}
              style={{ backgroundColor: "#7dc400", color: "#fff" }}
            >
              Confirm & Send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}