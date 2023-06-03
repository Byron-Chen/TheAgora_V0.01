import { Button, Form, Modal , Alert} from 'react-bootstrap'
import React, {useRef, useState, useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';

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
                {currentUser.email}

        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
    </Modal>
    </>
  );
}
