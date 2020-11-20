import React, { Fragment } from "react";
import { Option, OptionsGroup, Select } from "../../../components";

export type CategoryFee = {
  name: string;
  fee: number;
  exceptions?: Omit<CategoryFee, "exceptions">[];
};

type CategoryFeeSelectProps = {
  label?: string;
  value?: CategoryFee;
  style?: any;
  onChange?: (valeu: CategoryFee) => void;
};

const categories: CategoryFee[] = [
  { name: "Antiques", fee: 9.15 },
  { name: "Art", fee: 9.15 },
  { name: "Baby", fee: 9.15 },
  { name: "Books", fee: 12 },
  {
    name: "Busniess & Industrial",
    fee: 9.15,
    exceptions: [
      { name: "Heavy Equipment", fee: 1.5 },
      { name: "Commercial Printing Presses", fee: 1.5 },
      { name: "Food Trucks, Trailers & Carts", fee: 1.5 },
    ],
  },
  {
    name: "Camera, Photo, Memory Cards",
    fee: 6.15,
    exceptions: [
      { name: "Accessoris", fee: 9.15 },
      { name: "Replacement Parts & Tools", fee: 9.15 },
      { name: "Tripods & Supports", fee: 9.15 },
    ],
  },
  {
    name: "Cell Phone & Accessories",
    fee: 6.15,
  },
];

export default function CategoryFeeSelect(props: CategoryFeeSelectProps) {
  return (
    <Select
      mode="outlined"
      label={props.label}
      style={props.style}
      display={({ name, fee }: CategoryFee) => `${name} (${fee}%)`}
      onSelect={props?.onChange}
    >
      {categories.map((c, index) => (
        <Fragment key={index}>
          <Option value={c} />
          {c.exceptions && (
            <OptionsGroup>
              {c.exceptions.map((e, index) => (
                <Option key={index} value={e}></Option>
              ))}
            </OptionsGroup>
          )}
        </Fragment>
      ))}
    </Select>
  );
}
