import * as React from "react";
import { Text, Alert, ScrollView, TextStyle, StyleSheet } from "react-native";
import { Category, Transaction, TransactionsByMonth } from "../../types";
import { useSQLiteContext } from "expo-sqlite";

import TransactionList from "../../TransactionsList";
import Card from "../components/card";
import AddTransaction from "../../AddTransaction";

export default function Home() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [transactionsByMonth, setTransactionsByMonth] = React.useState<TransactionsByMonth>({
    totalExpenses: 0,
    totalIncome: 0,
  })

  const db = useSQLiteContext();

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    try {
      const result = await db.getAllAsync<Transaction>(`SELECT * FROM Transactions ORDER BY date DESC;`);
      setTransactions(result);

      const categoriesResult = await db.getAllAsync<Category>(`SELECT * FROM Categories;`);
      setCategories(categoriesResult);

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

      const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
      const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

      const transactionsByMonth = await db.getAllAsync<TransactionsByMonth>(`
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
          COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
        FROM Transactions
        WHERE date >= ? AND date <= ?;
        `, [startOfMonthTimestamp, endOfMonthTimestamp]);

        setTransactionsByMonth(transactionsByMonth[0]);
      
    } catch (error) {
      Alert.alert("Database", "Unable to get data");
      console.log(error);
    }
  }

  async function deleteTransaction(id: number) {
    try {
      db.withTransactionAsync(async () => {
        await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id])
        await getData();
      })
    } catch (error) {
      Alert.alert("Transaction", "Unable to Delete Transaction")
      console.log(error)
    }
  }

  async function insertTransaction(transaction: Transaction) {
    try {
      db.withTransactionAsync(async () => {
        await db.runAsync(`
            INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (?, ?, ?, ?, ?);
          `, [
            transaction.category_id,
            transaction.amount,
            transaction.date,
            transaction.description,
            transaction.type,
          ]);
          await getData();
      });
    } catch (error) {
      Alert.alert("Database", "Unable to insert entry")
      console.log(error)
    }
  }
  
  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 170, gap: 15, }}>
      <AddTransaction insertTransaction={insertTransaction} />
      <TransactionSummary totalExpenses={transactionsByMonth.totalExpenses} totalIncome={transactionsByMonth.totalIncome} />
      <TransactionList 
        categories={categories}
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />
    </ScrollView>
  );
}

function TransactionSummary({ totalIncome, totalExpenses }: TransactionsByMonth) {
  const savings = totalIncome - totalExpenses;
  const readablePeriod = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  const getMoneyTextStyle = (value: number): TextStyle => ({
    fontWeight: "bold",
    color: value < 0 ? "#FA586A" : "#2E8B57",
  })

  const formatMoney = (value: number) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? "-" : ""}$${absValue}`
  }

  return (
    <Card style={s.container}>
      <Text style={s.periodTitle}>Summary for {readablePeriod}</Text>

      <Text style={s.summaryText}>Income: {" "}
        <Text style={getMoneyTextStyle(totalIncome)}>
          {formatMoney(totalIncome)}
        </Text>
      </Text>
      
      <Text style={s.summaryText}>Expenses: {" "}
        <Text style={getMoneyTextStyle(totalExpenses)}>{formatMoney(totalExpenses)}</Text>
      </Text>

      <Text style={s.summaryText}>Savings: {" "}
        <Text style={getMoneyTextStyle(savings)}>{formatMoney(savings)}</Text>
      </Text>
    </Card>
  )
}

const s = StyleSheet.create({
  container: {
    marginBottom: 15,
    gap: 8,
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    color: "#555",
  },
})