import * as React from "react";
import { Category, Transaction } from "./types";
import { useSQLiteContext } from "expo-sqlite";
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Card from "./src/components/card";
import SegmentedControl from "@react-native-segmented-control/segmented-control";


export default function AddTransaction({
  insertTransaction, 
}: { insertTransaction(transaction: Transaction): Promise<void> }) {

    const [isAddingTransaction, setIsAddingTransaction] = React.useState<boolean>(false);
    const [currentTab, setCurrentTab] = React.useState<number>(0);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [typeSelected, setTypeSelected] = React.useState<string>("");
    const [amount, setAmount] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [category, setCategory] = React.useState<string>("Expense");
    const [categoryId, setCategoryId] = React.useState<number>(1);

    const db = useSQLiteContext();

    React.useEffect(() => {
      getExpenseType(currentTab);
    }, [currentTab]);

    async function getExpenseType(currentTab: number) {
      try {
        setCategory(currentTab === 0 ? "Expense" : "Income");
        const type = currentTab === 0 ? "Expense" : "Income";

        const result = await db.getAllAsync<Category>(
          `SELECT * FROM Categories WHERE type = ?`, [type]
        );
        
        setCategories(result)

      } catch (error) {
        Alert.alert("Database", "Unable to load data")
        console.log(error)
      }
    }

    async function handleSave() {
      try {
        console.log({
          amount: Number(amount),
          description,
          category_id: categoryId,
          date: new Date().getTime() / 1000,
          type: category as "Expense" | "Income",
        });

        //@ts-ignore
        await insertTransaction({
          amount: Number(amount),
          description,
          category_id: categoryId,
          date: new Date().getTime() / 1000,
          type: category as "Expense" | "Income",
        });

        setAmount("");
        setDescription("");
        setCategory("Expense");
        setCategoryId(1);
        setCurrentTab(0);
        setIsAddingTransaction(false);

      } catch (error) {
        Alert.alert("Database", "Unable to save changes")
        console.log(error)
      }
    }

  return (
    <View style={{ marginBottom: 15 }}>
      {isAddingTransaction ? (
        <View>
          <Card>
            <TextInput
              placeholder="$Amount"
              style={{ fontSize: 32, marginBottom: 15, fontWeight: "bold" }}
              keyboardType="numeric"
              onChangeText={(text) => {
                // Remove any non-numeric characters before setting the state
                const numericValue = text.replace(/[^0-9.]/g, "");
                setAmount(numericValue);
              }}
            />
            <TextInput
              placeholder="Description"
              style={{ marginBottom: 15 }}
              onChangeText={setDescription}
            />
            <Text style={{ marginBottom: 6 }}>Select a entry type:</Text>
            <SegmentedControl
              values={["Expense", "Income"]}
              style={{ marginBottom: 15 }}
              selectedIndex={currentTab}
              onChange={(event) => {
                setCurrentTab(event.nativeEvent.selectedSegmentIndex);
              }}
            />
            {categories.map((cat) => (
              <CategoryButton
                key={cat.name}
                // @ts-ignore
                id={cat.id}
                title={cat.name}
                isSelected={typeSelected === cat.name}
                setTypeSelected={setTypeSelected}
                setCategoryId={setCategoryId}
              />
            ))}
          </Card>
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10, }}>
            <Button
              title="Cancel"
              color="red"
              onPress={() => setIsAddingTransaction(false)}
            />
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      ) : (
        <AddButton setIsAddingTransaction={setIsAddingTransaction} />
      )}
    </View>
  );
}

function CategoryButton({
  id,
  title,
  isSelected,
  setTypeSelected,
  setCategoryId,
}: {
  id: number,
  title: string,
  isSelected: boolean,
  setTypeSelected: React.Dispatch<React.SetStateAction<string>>;
  setCategoryId: React.Dispatch<React.SetStateAction<Number>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setTypeSelected(title);
        setCategoryId(id);
      }}
      activeOpacity={0.8}
      style={{
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isSelected ? "#007BFF20" : "#00000020",
        borderRadius: 14,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontWeight: "700",
          color: isSelected ? "#007BFF" : "#000000",
          marginLeft: 5,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

function AddButton({ setIsAddingTransaction }: {
  setIsAddingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => setIsAddingTransaction(true)}
      activeOpacity={0.8}
      style={{
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007BFF20",
        borderRadius: 14,
      }}>
        <MaterialIcons name="add-circle-outline" size={24} color="#007BFF" />
        <Text style={{ fontWeight: "700", color: "#007BFF", marginLeft: 5 }}>Add</Text>
    </TouchableOpacity>
  )
}