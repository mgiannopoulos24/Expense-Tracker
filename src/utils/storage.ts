import type { Expense } from "./types"

// Get expenses for a user from localStorage
export function getExpenses(username: string): Expense[] {
  try {
    const key = `expenses_${username}`
    const data = localStorage.getItem(key)
    if (data) {
      const expenses = JSON.parse(data) as Expense[]
      // Sort by date descending (newest first)
      return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    return []
  } catch (error) {
    console.error("Error getting expenses:", error)
    return []
  }
}

// Add expense for a user to localStorage
export function addExpense(username: string, expenseData: Omit<Expense, "id" | "createdAt">): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const key = `expenses_${username}`
      const currentExpenses = getExpenses(username)

      const newExpense: Expense = {
        id: Date.now().toString(),
        ...expenseData,
        createdAt: new Date().toISOString(),
      }

      const updatedExpenses = [newExpense, ...currentExpenses]
      localStorage.setItem(key, JSON.stringify(updatedExpenses))
      resolve()
    } catch (error) {
      console.error("Error adding expense:", error)
      reject(error)
    }
  })
}

// Delete expense for a user from localStorage
export function deleteExpense(username: string, expenseId: string): void {
  const expenses = getExpenses(username);
  const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
  localStorage.setItem(`${username}_expenses`, JSON.stringify(updatedExpenses));
}
