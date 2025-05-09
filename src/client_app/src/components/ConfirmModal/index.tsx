import { IconAlertTriangle } from "@tabler/icons-react";
import { Col, Modal, Row, Spinner } from "react-bootstrap";

type Props = {
  isShow: boolean;
  confirmAction: () => void;
  isConfirming?: boolean;
  declineAction: () => void;
  title?: string;
  description?: string;
};

function ConfirmModal({
  isShow,
  declineAction,
  isConfirming: isAccepting = false,
  confirmAction: acceptAction,
  title = "Are you sure?",
  description = "Are you sure you want to remove this item",
}: Props) {
  return (
    <Modal
      show={isShow}
      size="sm"
      className="modal-blur"
      onHide={declineAction}
      centered
    >
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        onClick={declineAction}
      />
      <div className="modal-status bg-danger"></div>
      <div className="modal-body text-center py-4">
        <IconAlertTriangle className="icon mb-2 text-danger icon-lg" />

        <h3>{title}</h3>
        <div className="text-secondary">{description}</div>
      </div>
      <Modal.Footer className="justify-content-center">
        <Row className="w-100">
          <Col>
            <button
              className="btn w-100"
              data-bs-dismiss="modal"
              onClick={declineAction}
            >
              Cancel
            </button>
          </Col>
          <Col>
            <button
              className="btn btn-danger w-100"
              data-bs-dismiss="modal"
              onClick={acceptAction}
              disabled={isAccepting}
            >
              <Spinner
                className="me-2"
                hidden={!isAccepting}
                animation="border"
                size="sm"
              />
              Confirm
            </button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
