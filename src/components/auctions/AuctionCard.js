import React, { useContext, useState } from 'react'
import { Modal, Button, Container, Row, Col, Card } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { AuthContext } from '../../context/AuthContext';
import './auctioncard.css';


export const AuctionCard = ({ item }) => {
    let expiredDate = item.duration;
    const { currentUser, bidAuction, endAuction } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const renderAmountBoxes = (amounta) => {
        const amount = amounta;
        const rows = Math.ceil(amount / 10); // Calculate the number of rows
        const boxes = [];

        for (let i = 0; i < rows; i++) {
            const rowBoxes = [];

            for (let j = 0; j < 10; j++) {
                const boxNumber = i * 10 + j + 1;

                if (boxNumber <= amount) {
                    rowBoxes.push(
                        <div key={boxNumber} className="amount-box">
                            
                        </div>
                    );
                }
            }

            boxes.push(
                <div key={i} className="amount-row">
                    {rowBoxes}
                </div>
            );
        }

        return boxes;
    };


    const renderer = ({ days, hours, minutes, seconds, completed, props }) => {
        if (completed) {
            return null;
        }

        return (
            <div>
                <Modal show={modalVisible} onHide={closeModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered  >
                    <Modal.Header style={{ backgroundColor: '#F0F2F5' }}>
                        <Modal.Title>{item.title}</Modal.Title>
                        <Button variant="danger" onClick={closeModal}>
                            Close
                        </Button>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#F0F2F5' }}>
                        <Container>
                            <Row>
                                <div
                                    style={{
                                        height: '320px',
                                        backgroundImage: `url(${props.item.imgUrl})`,
                                        backgroundSize: 'contain',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid black',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        marginBottom: '1rem'
                                    }}
                                    className="w-100" />

                            </Row>
                            <Row>
                                <Col>

                                    <h4>Details</h4>
                                    <p>{item.desc}</p>
                                    <h4>Specifications</h4>
                                    <p>blablldf </p>
                                    <h4>Comments</h4>
                                    <p>this sucks </p>
                                </Col>
                                <Col>
                                    <div className='displayitemsfromamount'>
                                        {renderAmountBoxes(props.item.amount)}
                                    </div>
                                    <Card style={{
                                        width: '18rem',
                                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                                        }}>
                                        <Card.Body>
                                            <Card.Title>Current Bids</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Winner Name</Card.Subtitle>
                                            <Card.Text>
                                                dude bid $203023 or something
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>


                        {/* Display other item properties as needed */}
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#F0F2F5' }}>
                        
                    </Modal.Footer>
                </Modal>

                <div className={`col`} onClick={openModal}
                >
                    <div className="card shadow-sm ">
                        <div style={{
                            height: '320px',
                            backgroundImage: `url(${props.item.imgUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                        }}
                            className="w-100" />

                        <div className="card-body">
                            <p className="lead display-6">
                                {props.item.title} X {props.item.amount}
                            </p>


                            <div className="d-flex justify-content-between align-item-center">
                                <h5>
                                    {days * 24 + hours} hr: {minutes} min: {seconds} sec
                                </h5>
                            </div>
                            <p className="card-text">
                                {props.item.desc}
                            </p>
                            <div className="d-flex justify-content-between align-item-center">
                                <div>
                                    {!props.owner ? (
                                        <div onClick={() => props.bidAuction()}
                                            className="btn btn-primary">Bid</div>
                                    ) : props.owner.email === props.item.email ? (

                                        <div
                                            onClick={() => props.endAuction(props.item.id)}
                                            className="btn btn-primary">Cancel Auction</div>
                                    ) : props.owner.email === props.item.curWinner ? (
                                        <p className="display-6">Winner</p>

                                    ) : (
                                        <div
                                            onClick={() => props.bidAuction(props.item.id, props.item.curPrice)}
                                            className="btn btn-primary">Bid
                                        </div>

                                    )}

                                </div>
                                <p className="display-6">${props.item.curPrice}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )


    }


    return (
        <div>
            <Countdown
                owner={currentUser}
                date={expiredDate}
                bidAuction={bidAuction}
                endAuction={endAuction}
                item={item}
                renderer={renderer}
            />
        </div>
    );
}
