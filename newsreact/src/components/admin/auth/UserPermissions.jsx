import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function UserPermissions() {
  const [permissions, setPermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPermission, setCurrentPermission] = useState({ id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = () => {
    axios.get('/api/permissions/')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPermissions(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setPermissions(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching permissions:', error);
      });
  };

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPermission({ id: null, name: '' });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (currentPermission.name.trim() === '') {
      toast.error('Permission name is required');
      return;
    }

    if (isEditing) {
      axios.put(`/api/permissions/${currentPermission.id}`, { name: currentPermission.name })
        .then((response) => {
          toast.success('Permission updated successfully');
          fetchPermissions();
          handleCloseModal();
        })
        .catch((error) => {
          console.error('Error updating permission:', error);
          toast.error('Error updating permission');
        });
    } else {
      axios.post('/api/permissions/', { name: currentPermission.name })
        .then((response) => {
          toast.success('Permission created successfully');
          fetchPermissions();
          handleCloseModal();
        })
        .catch((error) => {
          console.error('Error creating permission:', error);
          toast.error('Error creating permission');
        });
    }
  };

  const handleEdit = (permission) => {
    setCurrentPermission(permission);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/permissions/${id}`)
          .then(() => {
            toast.success('Permission deleted successfully');
            fetchPermissions();
          })
          .catch((error) => {
            console.error('Error deleting permission:', error);
            toast.error('Error deleting permission');
          });
      }
    });
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>User Permissions</Card.Title>
          <Button className='float-end' onClick={handleShowModal}>Add New Permission</Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>SL</th>
                <th style={{ width: '10%' }}>Permission ID</th>
                <th style={{ width: '35%' }}>Permission Name</th>
                <th style={{ width: '50%' }} className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, index) => (
                <tr key={permission.id}>
                  <td>{index + 1}</td>
                  <td>{permission.id}</td>
                  <td>{permission.name}</td>
                  <td className='text-center'>
                    <Button className='btn btn-primary me-1' onClick={() => handleEdit(permission)}>Edit</Button>
                    <Button className='btn btn-danger' onClick={() => handleDelete(permission.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Permission' : 'Add New Permission'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formPermissionName">
              <Form.Label>Permission Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter permission name"
                value={currentPermission.name}
                onChange={(e) => setCurrentPermission({ ...currentPermission, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserPermissions;
