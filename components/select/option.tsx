import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Menu, Text } from "react-native-paper";
import { SelectContext } from "./context";

export type OptionProps = {
  value: any;
};

export function Option(props: OptionProps) {
  const { onSelect, viewWidth: width, displayer, isSelected } = useContext(
    SelectContext
  );
  return (
    <TouchableOpacity
      style={{
        backgroundColor: isSelected(props) ? "lightgray" : "white",
        width,
        padding: 16,
      }}
      onPress={() => onSelect(props)}
    >
      <Text>{displayer(props.value)}</Text>
    </TouchableOpacity>
  );
}
