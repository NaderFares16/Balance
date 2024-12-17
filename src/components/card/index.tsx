import { View, ViewStyle } from "react-native";
import { styles } from "./styles";
import React from "react";

interface CardProps extends React.PropsWithChildren{
  style?: ViewStyle;
}

export default function Card({ children, style = {} }: CardProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  )
}