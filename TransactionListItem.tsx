import { Text, View } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

import { AntDesign } from "@expo/vector-icons"

import { Category, Transaction } from "./types"
import Card from "./src/components/card";
import { categoryColors, categoryEmojies } from "./constants"

import { StyleSheet } from "react-native";
import iconSet from "@expo/vector-icons/build/FontAwesome5";

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category | undefined;
}

export default function TransactionItem({ transaction, categoryInfo }: TransactionListItemProps) {

  const iconName = transaction.type === "Expense" ? "minuscircle" : "pluscircle";
  const color = transaction.type === "Expense" ? "red" : "green";
  const categoryColor = categoryColors[categoryInfo?.name ?? "Default"];
  const emoji = categoryEmojies[categoryInfo?.name ?? "Default"]; 

  return (
    <Card>
      <View style={s.row}>
        <View style={{ flex: 1, width: "40%", gap: 10, justifyContent: "space-between" }}>
          <Amount amount={transaction.amount} color={color} iconName={iconName} />
            <CategoryItem 
              categoryColor={categoryColor}
              categoryInfo={categoryInfo}
              emoji={emoji}
            />
          </View>
          <TransactionInfo date={transaction.date} description={transaction.description} id={transaction.id} />
        </View>
    </Card>
  )
}

function TransactionInfo({ id, date, description }: {
  id: number,
  date: number;
  description: string;
}) {
  return (
    <View style={{ flexGrow: 1, gap: 6, flexShrink: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{description}</Text>
      <Text>Transaction ID: {id}</Text>
      <Text style={{ fontSize: 12, color: "gray" }}>
        {new Date(date * 1000).toDateString()}
      </Text>
    </View>
  )
}

function CategoryItem({ categoryColor, categoryInfo, emoji }: {
  categoryColor: string;
  categoryInfo: Category | undefined;
  emoji: string;
}) {
  return (
    <View style={[s.categoryContainer, { backgroundColor: categoryColor + "40" }]}>
      <Text style={s.categoryText}>
        {emoji} {categoryInfo?.name}
      </Text>
    </View>
  )
}

function Amount({ iconName, color, amount }: {
  iconName: "minuscircle" | "pluscircle";
  color: string,
  amount: number;
}) {
  return (
    <View style={s.row}>
      <AntDesign 
        name={iconName} size={18} color={color}
      />
      <AutoSizeText
        fontSize={32}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}
        style={[s.amount, { maxWidth: "80%" }]}
      >
        ${amount}
      </AutoSizeText>
    </View>
  )
}

const s = StyleSheet.create({
  amount: {
    fontSize: 32,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 12,
  }
})