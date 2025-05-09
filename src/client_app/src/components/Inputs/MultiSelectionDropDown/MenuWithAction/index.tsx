import React, { useMemo, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { List } from './styles';
import { CustomButton } from '@/components/common';
import Option from '@/models/option';

interface Props {
  children: any;
  style: Object;
  className?: string;
  labeledBy?: string;
  maxLength?: number;
  search: string;
  handleSearch: (text: string) => void;
  actionLabel: string;
  buttonAction: (value: string) => void;
  disabledAction: boolean;
}

const MenuWithAction = React.forwardRef(
  (
    {
      children,
      style,
      className,
      maxLength = 100,
      labeledBy,
      search,
      actionLabel,
      buttonAction,
      handleSearch,
      disabledAction,
    }: Props,
    ref: React.LegacyRef<HTMLDivElement>,
  ) => {
    const [localInputValue, setLocalInputValue] = useState<string>('');

    const shouldDisableAction = useMemo(() => {
      return !localInputValue || disabledAction;
    }, [disabledAction, localInputValue]);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          minWidth: '100%',
        }}
        aria-labelledby={labeledBy}
      >
        <div className="mx-3 my-2">
          <InputGroup>
            <Form.Control
              autoFocus
              placeholder="Type to search..."
              onChange={(event) => {
                setLocalInputValue(event.target.value);
                handleSearch(event.target.value);
              }}
              value={search}
              maxLength={maxLength}
            />
            <CustomButton
              $maxWidth="6rem"
              onClick={() => {
                buttonAction(localInputValue);
                handleSearch('');
              }}
              disabled={shouldDisableAction}
            >
              {actionLabel}
            </CustomButton>
          </InputGroup>
        </div>

        <List>{children.length > 0 && children}</List>
        {children.length === 0 && (
          <div className="text-center">No results found.</div>
        )}
      </div>
    );
  },
);

export default MenuWithAction;
