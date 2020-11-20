import React, { ReactElement } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { OptionProps } from "./option";

export type OptionsGroupProps = {
  display?: string | ReactElement;
  children?: ReactElement<OptionProps> | ReactElement<OptionProps>[];
};

export function OptionsGroup({ display, children }: OptionsGroupProps) {
  return (
    <View style={{ paddingLeft: 16 }}>
      {!display ? undefined : typeof display === "string" ? (
        <Text>{display}</Text>
      ) : (
        display
      )}
      <View style={{ marginLeft: 8 }}>{children}</View>
    </View>
  );
}
