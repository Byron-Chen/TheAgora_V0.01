import { Button, Col, Modal, Row } from "react-bootstrap";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useFirestore } from "../../hooks/useFirestore";

export const AddFriends = () => {
  const [showForm, setShowForm] = useState(false);

  const {isFriend, addFriend, currentUser} = useContext(AuthContext);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);
  const { docs } = useFirestore("users");
  const checkList = currentUser.friendsList
 
  const friendsNotInCurrent = () =>{
    let flist = []
    let checkList = currentUser.friendsList
    for (let i = 0; i < docs.length; i++) {
      
    }
  }

  const friendsClick = (userDoc) => {
    isFriend(userDoc.id).then(
      function(value){
        if (!value){
        addFriend(userDoc.id)
      }}
    )
      //

    //console.log(currentUser.email, userDoc.id);
  };
  return (
    <>
      <div onClick={openForm} className="btn btn-primary mx-2">
        Add Connections
      </div>
      <Modal centered show={showForm} onHide={closeForm}>
        <Modal.Header>
          <Modal.Title>Find Connections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {docs && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {docs.map((doc) => {
                  return (
                    <div key={doc.id} className="my-1">
                      <Row>
                        <Col>{doc.id}</Col>
                        <Col>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              console.log(isFriend(doc.id));
                              friendsClick(doc);
                            }}
                            className="btn btn-primary mx-2 "
                            size="sm"
                          >{isFriend(doc.id) ? (<div>add</div>): (<div>add2</div>)}
                            
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
