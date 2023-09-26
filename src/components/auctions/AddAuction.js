import { Button, Form, Modal, Alert, Row, Col } from "react-bootstrap";
import React, { useRef, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useFirestore } from "../../hooks/useFirestore";

export const AddAuction = ({ setAuction }) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const itemTitle = useRef();
  const itemDesc = useRef();
  const startPrice = useRef();
  const itemAmount = useRef();
  const itemDuration = useRef();
  const itemImage = useRef();
  const itemHashTag = useRef();

  const { currentUser } = useContext(AuthContext);
  const { docs } = useFirestore("users");

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const imgTypes = ["image/png", "image/jpeg", "image/jpg"];

  const currentUserFriendsList = () => {
    for (let i = 0; i < docs.length; i++) {
      if (currentUser.email == docs[i].id) {
        return docs[i].friendsList;
      }
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (!imgTypes.includes(itemImage.current.files[0].type)) {
      return setError("Please use a valid image");
    }

    let currentDate = new Date();

    let dueDate = currentDate.setHours(
      currentDate.getHours() + parseInt(itemDuration.current.value)
    );
    
    let getAllowedUserList = document.getElementsByClassName("form-check-input")
    let allowedUserList = []
    for (let i = 0; i < getAllowedUserList.length; i++) {
      if (getAllowedUserList[i].checked){
        allowedUserList.push(getAllowedUserList[i].id.split("check")[1])
      }
      
    }
    

    let hashtagsep = itemHashTag.current.value.split(/[,\s]+/);

    let newAuction = {
      email: currentUser.email,
      title: itemTitle.current.value,
      desc: itemDesc.current.value,
      curPrice: parseFloat(startPrice.current.value),
      amount: parseFloat(itemAmount.current.value),
      minimumBidAmount: 0,
      minimumBid:parseFloat(startPrice.current.value),
      minBidIncrement: 0.1,
      duration: dueDate,
      bidsList: [],
      currentWinner: [],
      currentCatchup: [],
      comments: [],
      allowedUsers: allowedUserList,
      currentWinnerAmount: 0,
      currentCatchupAmount: 0,
      powerBuyActive: false,
      hashTag: hashtagsep,
      itemImage: itemImage.current.files[0],
    };

    setAuction(newAuction);
    closeForm();
  };
  return (
    <>
      <div className="col d-flex justify-content-center my-3">
        <div onClick={openForm} className="btn btn-success mx-2">
          Add Auction
        </div>
      </div>
      <Modal centered show={showForm} onHide={closeForm} size="lg">
        <form onSubmit={submitForm}>
          <Modal.Header>
            <Modal.Title>Create Auction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Item Title</Form.Label>
                  <Form.Control type="text" required ref={itemTitle} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Item HashTag - Seperated by Comma</Form.Label>
                  <Form.Control as="textarea" rows={1} required ref={itemHashTag} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label>Item Description</Form.Label>
                <Form.Control as="textarea" rows={3} required ref={itemDesc} />
              </Form.Group>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Item Amount</Form.Label>
                  <Form.Control type="number" required ref={itemAmount} />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Start Price</Form.Label>
                  <Form.Control type="number" required ref={startPrice} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Item Duration</Form.Label>
                  <Form.Control type="number" required ref={itemDuration} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Seller</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentUser.email}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Item Image</Form.Label>
                  <Form.File
                    label="Select Item Image"
                    custom
                    required
                    ref={itemImage}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Form.Group>
                <div>Add Connections</div>
                {currentUserFriendsList() &&
                  currentUserFriendsList().map((doc) => (
                    <div key={doc}>
                      <Form.Check
                        type="checkbox"
                        id={`check${doc}`}
                        label={`${doc}`}
                      />
                    </div>
                  ))}
              </Form.Group>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
