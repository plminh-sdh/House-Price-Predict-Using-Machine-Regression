import { ErrorMessage } from "@hookform/error-message";
import { Form } from "react-bootstrap";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<any>;
  name: string;
};
function InputErrorMessage({ errors, name }: Props) {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => {
        return message !== undefined ? (
          <Form.Control.Feedback type="invalid" className="text-start">
            {message}
          </Form.Control.Feedback>
        ) : (
          <></>
        );
      }}
    />
  );
}

export default InputErrorMessage;
