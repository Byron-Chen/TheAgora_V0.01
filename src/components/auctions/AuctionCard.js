import React, { useContext, useRef, useState } from "react";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
} from "react-bootstrap";
import Countdown from "react-countdown";
import { AuthContext } from "../../context/AuthContext";

import "./auctioncard.css";

export const AuctionCard = ({ item }) => {
  let expiredDate = item.duration;
  const { currentUser, bidAuction, endAuction, addBid, checkBid, addComment} = useContext(AuthContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    priceForm: "",
    amountForm: "",
  });
  const md5 = require("md5");
    const colours = [
        "#e6261f",
        "#eb7532",
        "#f7d038",
        "#a3e048",
        "#49da9a",
        "#34bbe6",
        "#4355db",
        "#d23be7",
        '#77D64D',
        '#4D830D',
        '#E5FFB3',
        '#42890A',
        '#C55013',
        '#6F0B19',
        '#EC8688',
        '#3389DE',
        '#93B8C2',
        '#A48FCB',
        '#4A9B51',
        '#A980DE',
        '#3FCEF8',
        '#3D38F9',
        '#089C28',
        '#0085E9',
        '#BE1306',
        '#839D89',
        '#C65C13',
        '#F225F5',
        '#D11B71',
        '#BD6B55',
        '#E0CF69',
        '#838AE9',
        '#DC1139',
        '#FDA527',
        '#EE4257',
        '#A1FFF9',
        '#4CFEFB',
        '#533500',
        '#FBAE06',
        '#486BDC',
        '#F94D11',
        '#E94E6A',
        '#6065DD',
        '#981757',
        '#6A7ABB',
        '#25A290',
        '#BE6188',
        '#EFB602',
        '#4FCE16',
        '#7E1A9C',
        '#EABACC',
        '#DC16CC',
        '#365E44',
        '#2E7FD0',
        '#C0455F',
        '#5F2782',
        '#4BF1D0'
    ];

  const rndColor = (email) => {
    const hash = md5(email);
    const hashSlice = hash.slice(0, 6);
    const hashNum = parseInt(hashSlice, 16);
    const index = hashNum % colours.length;

    return colours[index];
  };

  const bidPriceRef = useRef();
  const bidAmountRef = useRef();
  const auctionComment = useRef();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setFormData({
      priceForm: "",
      amountForm: "",
    });
  };

  const renderAmountBoxes = (amount, list) => {
    const boxes = [];
    let boxCounter = 1;

    for (let i = 0; i < list.length; i++) {
      const { email, amount } = list[i];

      const color = rndColor(email); 

      for (let j = 0; j < amount; j++) {
        const boxKey = `box-${boxCounter}`;

        boxes.push(
          <div
            key={boxKey}
            className="amount-box"
            style={{ backgroundColor: color }} 
          ></div>
        );

        boxCounter++;
      }
    }
    while (boxCounter - 1 < amount) {
      const boxKey = `box-${boxCounter}`;
      boxes.push(
        <div
          key={boxKey}
          className="amount-box"
          style={{ backgroundColor: "#808080" }} 
        ></div>
      );
      boxCounter++;
    }

    return <div className="amount-row">{boxes}</div>;
  };

  const toDateTime = (secs)=>{
    var t = new Date(1970, 0, 1); 
    t.setSeconds(secs);
    let rt = t.toString().split(" ")
    return "-" + rt[4] + " " + rt[2] + " " + rt[1] + " ";
}

  const submitComment = async(e) => {
    e.preventDefault();
    //addComment(item, )
    addComment(item, auctionComment.current.value, currentUser.email)
    auctionComment.current.value = ""
    
  }

  const renderer = ({ days, hours, minutes, seconds, completed, props }) => {
    //if (completed) {
    //    return null;
    //}

    return (
      <div>
        <Modal
          show={modalVisible}
          onHide={closeModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{ backgroundColor: "#F0F2F5" }}>
            <Modal.Title>
              {props.item.title} x {props.item.amount}
            </Modal.Title>
            <Button variant="danger" onClick={closeModal}>
              Close
            </Button>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#F0F2F5" }}>
            <Container>
              <Row>
                <div
                  style={{
                    height: "320px",
                    backgroundImage: `url(${props.item.imgUrl})`,
                    backgroundSize: "contain",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid black",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    marginBottom: "1rem",
                  }}
                  className="w-100"
                />
              </Row>
              <Row>
                <Col>
                  <h4>Details</h4>
                  <p>{item.desc}</p>
                  <h4>Comments</h4>

                  {currentUser ? ( <form onSubmit={submitComment}>
                  <Form.Group>
                    <Col>
                      <Form.Control as="textarea" rows={1}  required ref={auctionComment} />
                      <Button variant='primary' type="submit">Submit</Button>
                    </Col>
                  </Form.Group>
                  </form>) : (<p></p>)}
                  {}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                  {props.item.comment &&
                          props.item.comment.map((item, index) => (
                            <div key={index}>
                              <p style={{ margin: "0", float: "left" }}>
                                {item.email}: {item.comment}
                              </p>
                            </div>
                          ))}
                  </div>
                </Col>
                <Col>
                  <div className="displayitemsfromamount">
                    {renderAmountBoxes(
                      props.item.amount,
                      props.item.currentWinner
                    )}
                  </div>
                  <Card
                    style={{
                      width: "100%",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                      marginTop: "10px",
                    }}
                  >
                    <Card.Body className="justify-content-center">
                      <Card.Title className="text-center">
                        Current Winner
                      </Card.Title>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {props.item.currentWinner &&
                          props.item.currentWinner.map((item, index) => (
                            <div key={index}>
                              <p style={{ margin: "0", float: "left" }}>
                                {item.amount} x ${item.price}
                              </p>
                              <p style={{ margin: "0", float: "right" }}>
                                {toDateTime(item.date.seconds).toString()}
                              </p>
                              <p style={{ margin: "0", float: "right" }}>
                                {item.email}
                              </p>
                              
                            </div>
                          ))}
                      </div>
                    </Card.Body>
                  </Card>
                  {!completed && currentUser? (
                    <Card
                      style={{
                        width: "100%",
                        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                        marginTop: "10px",
                      }}
                    >
                      <Card.Body className="justify-content-center">
                        <Row xs="auto">
                          <Col xs={5}>
                            <Form.Control
                              type="number"
                              required
                              ref={bidAmountRef}
                            />
                          </Col>
                          <Col>
                            <h4 style={{ margin: "0", textAlign: "center" }}>
                              X
                            </h4>
                          </Col>
                          <Col xs={5}>
                            <Form.Control
                              type="number"
                              placeholder="$"
                              required
                              ref={bidPriceRef}
                            />
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-center mt-1">
                          <div
                            onClick={() =>
                              props.addBid(
                                props.item.id,
                                props.owner.email,
                                bidPriceRef.current.value,
                                bidAmountRef.current.value
                              )
                              
                            }
                            className="btn btn-primary"
                          >
                            Place Bid
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ) : (
                    <h5 className="d-flex justify-content-center mt-1">
                      
                    </h5>

                  )}
                  <Card
                    style={{
                      width: "100%",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                      marginTop: "10px",
                    }}
                  >
                    <Card.Body>
                      <Card.Title className="text-center">
                        Current Bids
                      </Card.Title>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {props.item.bidsList &&
                          props.item.bidsList.map((item, index) => (
                            <div key={index}>
                              <p style={{ margin: "0", float: "left" }}>
                                {item.amount} x ${item.price}
                              </p>
                              <p style={{ margin: "0", float: "right" }}>
                                {item.email}
                              </p>
                              
                            </div>
                          ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
            {}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#F0F2F5" }}></Modal.Footer>
        </Modal>

        <div className={`col`} onClick={openModal}>
          <div className="card shadow-sm ">
            <div
              style={{
                height: "300px",
                backgroundImage: `url(${props.item.imgUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="w-100 bg-light"
            />

            <div className="card-body">
              <div className="">
                {props.item.hashTag && props.item.hashTag.map((item, index) => (
                        <div key={index} >
                          <p style={{ margin: "0", float: "left" }}>
                            #{item}
                          </p>
                        </div>
                      ))}
              </div>
              <br></br>
              <h4 className="my-0">
                {props.item.title} X {props.item.amount}
              </h4>

              {completed ? (
                <h5 className="my-1">Completed</h5>
              ) : (
                <div className="d-flex justify-content-between align-item-center">
                  <h5 className="my-1">
                    {days * 24 + hours} hr: {minutes} min: {seconds} sec
                  </h5>
                </div>
              )}
              <p className="card-text my-0">{(props.item.desc).substring(0, 43) + "..."}</p>
              <div className="d-flex justify-content-between align-item-center">
                {completed? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h5 className="my-1">Winner</h5>
                    {props.item.bidsList && props.item.currentWinner.map((item, index) => (
                        <div key={index} >
                          <p style={{ margin: "0", float: "left" }}>
                            {item.amount} x ${item.price} {item.email}
                          </p>
                        </div>
                      ))}
                      </div>
                    
                ):(
                    <h5 className="my-1">Highest Bid: ${props.item.curPrice}</h5>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Countdown
        owner={currentUser}
        date={expiredDate}
        addBid={addBid}
        bidAuction={bidAuction}
        endAuction={endAuction}
        checkBid={checkBid}
        item={item}
        renderer={renderer}
      />
    </div>
  );
};
