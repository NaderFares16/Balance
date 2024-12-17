import { TouchableOpacity, View, Text } from "react-native";
import { Category, Transaction } from "./types"
import TransactionItem from "./TransactionListItem";

export default function TransactionList({
  transactions,
  categories,
  deleteTransaction,
}:{
  categories: Category[],
  transactions: Transaction[],
  deleteTransaction: (id: number) => Promise<void>;
}) {
  return(
    <View>
      {transactions.map((transaction) => {

        const categoryForCurrentItem = categories.find(
          (category) => category.id === transaction.category_id
        )

        return (
          <TouchableOpacity
            key={transaction.id}
            activeOpacity={0.8}
            onLongPress={() => deleteTransaction(transaction.id)}
          >
            <TransactionItem transaction={transaction} categoryInfo={categoryForCurrentItem} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}