import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, LogOut, Trash2 } from "lucide-react"
import { ExpenseForm } from "@/components/ExpenseForm"
import { ExpenseCharts } from "@/components/ExpenseCharts"
import { getExpenses, deleteExpense } from "@/utils/storage"
import type { Expense } from "@/utils/types"

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const username = searchParams.get("user")
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    if (username) {
      const userExpenses = getExpenses(username)
      setExpenses(userExpenses)
    }
  }, [username])

  const handleExpenseAdded = () => {
    if (username) {
      const userExpenses = getExpenses(username)
      setExpenses(userExpenses)
    }
  }

  const handleExpenseDelete = (expenseId: string) => {
    if (username) {
      deleteExpense(username, expenseId)
      setExpenses(expenses.filter(expense => expense.id !== expenseId))
    }
  }

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to access your expenses.</p>
            <Link to="/">
              <Button className="mt-4">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-sm text-gray-600">Welcome back, {username}</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlusCircle className="h-5 w-5" />
                  <span>Add Expense</span>
                </CardTitle>
                <CardDescription>Track your daily expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm username={username} onExpenseAdded={handleExpenseAdded} />
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2">
            <ExpenseCharts expenses={expenses} />
          </div>
        </div>

        {/* Recent Expenses */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expenses recorded yet. Add your first expense above!</p>
            ) : (
              <div className="space-y-4">
                {expenses.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-600">{expense.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold">${expense.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleExpenseDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
