import {Modal, Row, Col} from 'react-bootstrap'
import React, { useState, useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';
import profileimg from '../../assets/profilepic4.png';
import { useFirestore } from '../../hooks/useFirestore';

export const ProfilePage = () => {
    const [showForm, setShowForm] = useState(false);

    const {currentUser} = useContext(AuthContext);

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);
    const { docs } = useFirestore("users");

    const currentUserFriendsList = () => {
      for (let i = 0; i < docs.length; i++) {
          if (currentUser.email == docs[i].id){
              return docs[i].friendsList;
          }
      }
    }
    

  return (
  <>
    <div onClick={openForm} className="btn btn-primary mx-2">Profile</div>
    <Modal centered show={showForm} onHide={closeForm}>
        <Modal.Header>
            <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={profileimg} alt="profilepic" height="100" />
                <div>{currentUser.email}</div>
        <h3>Friends List</h3>
        <div>
            {currentUserFriendsList() && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {currentUserFriendsList().map((doc) => {
                  return (
                    <div key={doc} className="my-1">
                      <Row>
                        <Col>{doc}</Col>
                      </Row>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
    </Modal>
    </>
  );
}
