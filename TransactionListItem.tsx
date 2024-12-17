import { Text } from "react-native";

import { Category, Transaction } from "./types"
import Card from "./src/components/card";

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category | undefined;
}

export default function TransactionItem({ transaction, categoryInfo }: TransactionListItemProps) {
  return (
    <Card>
      <Text>
        {categoryInfo?.name} amount: {transaction.amount}
      </Text>
    </Card>
  )
}