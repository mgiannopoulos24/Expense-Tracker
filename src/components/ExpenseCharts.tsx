import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { Expense } from "@/utils/types"

interface ExpenseChartsProps {
  expenses: Expense[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  // Get current date info
  const now = new Date()
  const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Filter expenses for current week
  const weeklyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate >= currentWeekStart
  })

  // Filter expenses for current month
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate >= currentMonthStart
  })

  // Aggregate by category for pie charts
  const aggregateByCategory = (expenseList: Expense[]) => {
    const categoryTotals: Record<string, number> = {}
    expenseList.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2)),
    }))
  }

  // Aggregate by day for bar charts
  const aggregateByDay = (expenseList: Expense[]) => {
    const dayTotals: Record<string, number> = {}
    expenseList.forEach((expense) => {
      const day = new Date(expense.date).toLocaleDateString("en-US", { weekday: "short" })
      dayTotals[day] = (dayTotals[day] || 0) + expense.amount
    })
    return Object.entries(dayTotals).map(([day, amount]) => ({
      day,
      amount: Number(amount.toFixed(2)),
    }))
  }

  const weeklyByCategory = aggregateByCategory(weeklyExpenses)
  const monthlyByCategory = aggregateByCategory(monthlyExpenses)
  const weeklyByDay = aggregateByDay(weeklyExpenses)

  const weeklyTotal = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">${weeklyTotal.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{weeklyExpenses.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">${monthlyTotal.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{monthlyExpenses.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            {/* Weekly Pie Chart - Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories (This Week)</CardTitle>
                <CardDescription>Weekly spending breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                {weeklyByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={weeklyByCategory}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ category, amount }) => `${category}: $${amount}`}
                      >
                        {weeklyByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`$${value}`, props.payload.category]}
                        labelFormatter={() => ""}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    No expenses this week
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            {/* Monthly Pie Chart - Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories (This Month)</CardTitle>
                <CardDescription>Monthly spending breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={monthlyByCategory}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ category, amount }) => `${category}: $${amount}`}
                      >
                        {monthlyByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`$${value}`, props.payload.category]}
                        labelFormatter={() => ""}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    No expenses this month
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
