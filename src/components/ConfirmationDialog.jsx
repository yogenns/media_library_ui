import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ConfirmationDialog(props) {
  return (
    <>
    <Modal show={props.show} onHide={props.handleCancel}>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={props.handleConfirm}>
          {props.confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default ConfirmationDialog;
