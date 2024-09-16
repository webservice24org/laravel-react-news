import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function Division() {
  const [divisions, setDivisions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDivision, setCurrentDivision] = useState({ id: null, division_name: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDivisions();
  }, []);


  const fetchDivisions = () => {
    axios.get('/api/divisions/')
      .then((response) => {
        if (Array.isArray(response.data)) {
            setDivisions(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
            setDivisions(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching Division:', error);
      });
  };


  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDivision({ id: null, division_name: '' });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (currentDivision.division_name.trim() === '') {
      toast.error('Division name is required');
      return;
    }

    if (isEditing) {
      axios.put(`/api/divisions/${currentDivision.id}`, { division_name: currentDivision.division_name })
        .then((response) => {
          toast.success('Division updated successfully');
          fetchDivisions();
          handleCloseModal();
        })
        .catch((error) => {
          console.error('Error updating division:', error);
          toast.error('Error updating division');
        });
    } else {
      axios.post('/api/divisions/', { division_name: currentDivision.division_name })
        .then((response) => {
          toast.success('Division created successfully');
          fetchDivisions();
          handleCloseModal();
        })
        .catch((error) => {
          console.error('Error creating division:', error);
          toast.error('Error creating division');
        });
    }
  };

  const handleEdit = (division) => {
    setCurrentDivision(division);
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
        axios.delete(`/api/divisions/${id}`)
          .then(() => {
            toast.success('Division deleted successfully');
            fetchDivisions();
          })
          .catch((error) => {
            console.error('Error deleting division:', error);
            toast.error('Error deleting division');
          });
      }
    });
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>Divisions</Card.Title>
          <Button className='float-end' onClick={handleShowModal}>Add New Division</Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>ID</th>
                <th style={{ width: '40%' }}>Division Name</th>
                <th style={{ width: '55%' }} className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(divisions) && divisions.length > 0 ? (
                divisions.map((division, index) => (
                  <tr key={division.id}>
                    <td>{division.id}</td>
                    <td>{division.division_name}</td>
                    <td className='text-center'>
                      <Button className='btn btn-primary me-1' onClick={() => handleEdit(division)}>Edit</Button>
                      <Button className='btn btn-danger' onClick={() => handleDelete(division.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No divisions found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Division' : 'Add New Division'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formDivisionName">
              <Form.Label>Division Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter division name"
                value={currentDivision.division_name}
                onChange={(e) => setCurrentDivision({ ...currentDivision, division_name: e.target.value })}
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

export default Division;
