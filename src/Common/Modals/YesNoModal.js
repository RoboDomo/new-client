import React from "react";
import { Modal, ButtonGroup, Button } from "react-bootstrap";

// props:
//   show - show modal if true
//   onSelect(bool) - called when yes (true) or no (false) is selected
//   yes - optional "YES" button text (defaults to YES)
//   no - optional "NO" button text (defaults to NO)
//   title - optional dialog title (defaults to "COFIRM")
//   question - optional dialog text (defaults to yes text or no text)

class YesNoModal extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    let {
      show,
      onSelect,
      yes = "YES",
      no = "NO",
      title = "CONFIRM",
      question,
    } = this.props;

    question = question || `Choose ${yes} or ${no}`;
    return (
      <Modal
        show={show}
        onHide={() => {
          if (onSelect) {
            onSelect(false);
          }
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{question}</Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant="danger"
              onClick={() => {
                if (onSelect) {
                  onSelect(false);
                }
              }}
            >
              {no}
            </Button>
            <Button
              variant="success"
              onClick={() => {
                if (onSelect) {
                  onSelect(true);
                }
              }}
            >
              {yes}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }
}

//
export default YesNoModal;
