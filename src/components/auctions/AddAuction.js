import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap'
import React, { useRef, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';

export const AddAuction = ({ setAuction }) => {
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    const itemTitle = useRef();
    const itemDesc = useRef();
    const startPrice = useRef();
    const itemAmount = useRef();
    const itemDuration = useRef();
    const itemImage = useRef();

    const { currentUser } = useContext(AuthContext)

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);

    const imgTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const submitForm = async (e) => {
        e.preventDefault();
        setError('');

        if (!imgTypes.includes(itemImage.current.files[0].type)) {
            return setError('Please use a valid image')
        }

        let currentDate = new Date();
        
        let dueDate = currentDate.setHours(
            currentDate.getHours() + parseInt(itemDuration.current.value)
        )

        let newAuction = {
            email: currentUser.email,
            title: itemTitle.current.value,
            desc: itemDesc.current.value,
            curPrice: startPrice.current.value,
            amount: itemAmount.current.value,
            duration: dueDate,
            bidsList: [],
            currentWinner: [],
            currentCatchup: [],
            currentWinnerAmount : 0,
            currentCatchupAmount: 0,
            itemImage: itemImage.current.files[0],
        }

        setAuction(newAuction);
        closeForm();
    }
    return (
        <>
            <div className="col d-flex justify-content-center my-3">
                <div onClick={openForm} className="btn btn-success mx-2">Add Auction</div>
            </div>
            <Modal centered show={showForm} onHide={closeForm} size="lg">
                <form onSubmit={submitForm}>
                    <Modal.Header>
                        <Modal.Title>Create Auction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Item Title</Form.Label>
                                    <Form.Control type="text" required ref={itemTitle} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                                <Form.Group>
                                    <Form.Label>Item Description</Form.Label>
                                    <Form.Control as="textarea" rows={3}  required ref={itemDesc} />
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
                                        readOnly />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Item Image</Form.Label>
                                    <Form.File
                                        label="Select Item Image"
                                        custom
                                        required
                                        ref={itemImage} />
                                </Form.Group>
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={closeForm}>Cancel</Button>
                        <Button variant='primary' type="submit">Submit</Button>
                    </Modal.Footer></form>
            </Modal>
        </>
    );
}
