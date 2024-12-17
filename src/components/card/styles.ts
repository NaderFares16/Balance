import { StyleSheet } from "react-native";
import { colors } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: colors.white.base,
    elevation: 0,
    shadowColor: "#999",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15, 
  },
})