import { createContext } from "react";

export const SelectContext = createContext({
  viewWidth: 0,
  onSelect: (opt: any) => {},
  displayer: (value: any) => "",
  isSelected: (opt: any) => false as boolean,
});
