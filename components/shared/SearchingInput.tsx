import debounce from "lodash.debounce";
import React from "react";
import { SearchInput } from "./SearchInput";

type Props = {
  afterDebounce?: (value:string) => void;
  placeholder:string
};

const SearchingInput = (props: Props) => {
  const [value, setValue] = React.useState("");
  return (
    <SearchInput
      clearSearchIcon={value.length > 0}
      value={value}
      onChangeText={(t) => {
        debounce(() => props.afterDebounce?.(t), 250)();
        setValue(t);
      }}
      
      placeholder={props.placeholder}
      className="mx-4"
    />
  );
};

export default SearchingInput;
