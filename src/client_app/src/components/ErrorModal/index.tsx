import { IconAlertTriangle } from "@tabler/icons-react";
import { Modal } from "react-bootstrap";
type Props = {
  showModal: boolean;
  handleCloseModal: () => void;
  title: string;
  content: string;
  action: string;
  isStatic?: boolean;
  size?: any;
};
function ErrorModal({
  showModal,
  handleCloseModal,
  title,
  content,
  action,
  isStatic = true,
  size = "sm",
}: Props) {
  return (
    <>
      <Modal
        show={showModal}
        size={size ? size : "sm"}
        className="modal-blur"
        onHide={handleCloseModal}
        backdrop={isStatic ? "static" : true}
        centered
      >
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={handleCloseModal}
        />
        <div className="modal-status bg-danger"></div>
        <div className="modal-body text-center py-4">
          <IconAlertTriangle className="icon mb-2 text-danger icon-lg" />

          <h3>{title}</h3>
          <div
            className="text-secondary"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <Modal.Footer className="justify-content-center">
          <button
            className="btn btn-danger w-100"
            data-bs-dismiss="modal"
            onClick={handleCloseModal}
          >
            {action}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ErrorModal;
