import * as React from "react";
import { Alert, ScrollView } from "react-native";
import { Category, Transaction } from "../../types";
import { useSQLiteContext } from "expo-sqlite";

import TransactionList from "../../TransactionsList";

export default function Home() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

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
  
  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 170 }}>
      <TransactionList 
        categories={categories}
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />
    </ScrollView>
  );
}