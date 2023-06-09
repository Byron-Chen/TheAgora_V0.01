import { Button, Form, Modal , Alert} from 'react-bootstrap'
import React, {useRef, useState, useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';
import profileimg from '../../assets/profilepic4.png'

export const ProfilePage = () => {
    const [showForm, setShowForm] = useState(false);

    const {currentUser} = useContext(AuthContext);

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);

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

        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
    </Modal>
    </>
  );
}
