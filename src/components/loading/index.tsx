import { View, ActivityIndicator } from "react-native";
import { style } from "./styles";

export function Loading() {
  return (
    <View style={style.container}>
      <ActivityIndicator size={"large"} style={style.container} color="#7AE582" />
    </View>
  )
}