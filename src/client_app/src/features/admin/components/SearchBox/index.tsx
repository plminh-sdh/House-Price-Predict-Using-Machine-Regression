import { debounce } from "lodash";
import React, { useState } from "react";

import { InputBox, ClearIcon, SearchIcon } from "./styles";

interface SearchBoxProps {
  onSearchDispatch: any;
}

function SearchBox({ onSearchDispatch }: SearchBoxProps) {
  const [searchText, setSearchText] = useState<string>("");

  const debounceSearchText = React.useCallback(
    debounce((nextValue: string | null) => onSearchDispatch(nextValue), 250),
    []
  );

  return (
    <div className="position-relative">
      <InputBox
        data-testid="searchBox"
        value={searchText}
        placeholder="Search"
        maxLength={255}
        onChange={(e: any) => {
          setSearchText(e.target.value);
          debounceSearchText(e.target.value !== "" ? e.target.value : null);
        }}
      />
      <SearchIcon />
      {searchText && (
        <ClearIcon
          onClick={() => {
            setSearchText("");
            onSearchDispatch("");
          }}
        />
      )}
    </div>
  );
}

export default SearchBox;
