import { IconX } from "@tabler/icons-react";
import { Item } from "./styles";

interface Props {
  value: string;
  displayValue: string;
  removeItem: (itemKey: string) => void;
}

function SelectedItem({ displayValue, value, removeItem }: Props) {
  return (
    <Item className="ps-1 pe-2">
      <IconX
        role="button"
        onClick={() => removeItem(value)}
        size={14}
        className="me-1 text-danger"
      />
      {displayValue}
    </Item>
  );
}

export default SelectedItem;
