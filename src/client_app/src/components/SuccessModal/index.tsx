import { Modal } from "react-bootstrap";
import { IconCircleCheck } from "@tabler/icons-react";

type Props = {
  showModal: boolean;
  handleCloseModal: () => void;
  title: string;
  content: string;
  action: string;
  isStatic?: boolean;
};
function SuccessModal({
  showModal,
  handleCloseModal,
  title,
  content,
  action,
  isStatic = true,
}: Props) {
  return (
    <>
      <Modal
        show={showModal}
        size="sm"
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
        <div className="modal-status bg-success"></div>
        <div className="modal-body text-center py-4">
          <IconCircleCheck className="icon mb-2 text-success icon-lg" />

          <h3>{title}</h3>
          <div className="text-secondary">{content}</div>
        </div>
        <Modal.Footer className="justify-content-center">
          <button
            className="btn btn-success w-100"
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

export default SuccessModal;
