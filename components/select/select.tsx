import React, { ReactElement, useState } from "react";
import { StyleProp, TextStyle, TouchableOpacity, View } from "react-native";
import { List, Menu, TextInput } from "react-native-paper";
import { SelectContext } from "./context";
import { OptionProps } from "./option";
import { OptionsGroupProps } from "./options-group";

type SelectPropsChild =
  | ReactElement<OptionProps>
  | ReactElement<OptionsGroupProps>;

type SelectProps = {
  mode?: "flat" | "outlined";
  label?: string;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
  error?: boolean;
  display?: (value: any) => string;
  onSelect?: (value: any) => void;
  children?: SelectPropsChild | SelectPropsChild[];
};

export default function Select(props: SelectProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [viewWidth, setViewWidth] = useState(0);
  const [selected, setSelected] = useState<any>(undefined);
  const onSelect = (opt: OptionProps) => {
    setSelected(opt.value);

    if (props.onSelect) {
      props.onSelect(opt.value);
    }

    setIsOpened(false);
  };
  const isSelected = (opt: OptionProps) => selected === opt.value;
  const displayer = props.display ?? ((value: any) => value);

  return (
    <Menu
      visible={isOpened}
      onDismiss={() => setIsOpened(false)}
      anchor={
        <TouchableOpacity
          style={props.style}
          onPress={props.disabled ? undefined : () => setIsOpened(true)}
          onLayout={({
            nativeEvent: {
              layout: { width },
            },
          }) => setViewWidth(width)}
        >
          <View pointerEvents="none">
            <TextInput
              pointerEvents="none"
              error={props.error}
              mode={props.mode}
              label={props.label}
              onChangeText={undefined}
              editable={false}
              value={selected && displayer(selected)}
            ></TextInput>
          </View>
          <List.Icon
            icon="menu-down"
            style={{ position: "absolute", right: 0, bottom: 0, margin: 16 }}
          />
        </TouchableOpacity>
      }
    >
      <SelectContext.Provider
        value={{ onSelect, viewWidth, displayer, isSelected }}
      >
        {props.children}
      </SelectContext.Provider>
    </Menu>
  );
}
