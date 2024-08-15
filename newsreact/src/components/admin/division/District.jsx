import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function District() {
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState({ id: null, division_id: '', district_name: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDistricts();
    fetchDivisions();
  }, []);

  const fetchDistricts = (divisionId = '') => {
    let url = '/api/districts/';
    if (divisionId) {
      url += `?division_id=${divisionId}`;
    }

    axios.get(url)
      .then((response) => {
        console.log('Fetched Districts:', response.data); // Debugging log
        if (Array.isArray(response.data.data)) {
          setDistricts(response.data.data);
        } else {
          toast.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching Districts:', error); // Debugging log
        toast.error('Error fetching Districts:', error);
      });
  };

  const fetchDivisions = () => {
    axios.get('/api/divisions/')
      .then((response) => {
        console.log('Fetched Divisions:', response.data); // Debugging log
        if (Array.isArray(response.data.data)) {
          setDivisions(response.data.data);
        } else {
          toast.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching Divisions:', error); // Debugging log
        toast.error('Error fetching Divisions:', error);
      });
  };

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDistrict({ id: null, division_id: '', district_name: '' });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!currentDistrict.division_id || currentDistrict.district_name.trim() === '') {
      toast.error('All fields are required');
      return;
    }

    if (isEditing) {
      axios.put(`/api/districts/${currentDistrict.id}`, {
        division_id: currentDistrict.division_id,
        district_name: currentDistrict.district_name
      })
        .then((response) => {
          toast.success('District updated successfully');
          fetchDistricts();
          handleCloseModal();
        })
        .catch((error) => {
          console.error('Error updating district:', error); // Debugging log
          toast.error('Error updating district');
        });
    } else {
      axios.post('/api/districts/', {
        division_id: currentDistrict.division_id,
        district_name: currentDistrict.district_name
      })
        .then((response) => {
          toast.success('District created successfully');
          fetchDistricts();
          handleCloseModal();
        })
        .catch((error) => {
          console.error('Error creating district:', error); // Debugging log
          toast.error('Error creating district');
        });
    }
  };

  const handleEdit = (district) => {
    setCurrentDistrict(district);
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
        axios.delete(`/api/districts/${id}`)
          .then(() => {
            toast.success('District deleted successfully');
            fetchDistricts();
          })
          .catch((error) => {
            console.error('Error deleting district:', error); // Debugging log
            toast.error('Error deleting district');
          });
      }
    });
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>Districts</Card.Title>
          <Button className='float-end' onClick={handleShowModal}>Add New District</Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>SL</th>
                <th style={{ width: '20%' }}>Division Name</th>
                <th style={{ width: '35%' }}>District Name</th>
                <th style={{ width: '40%' }} className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {districts.length > 0 ? (
                districts.map((district, index) => (
                  <tr key={district.id}>
                    <td>{index + 1}</td>
                    <td>{divisions.find(division => division.id === district.division_id)?.division_name}</td>
                    <td>{district.district_name}</td>
                    <td className='text-center'>
                      <Button className='btn btn-primary me-1' onClick={() => handleEdit(district)}>Edit</Button>
                      <Button className='btn btn-danger' onClick={() => handleDelete(district.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No districts found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit District' : 'Add New District'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formDivisionSelect">
              <Form.Label>Division</Form.Label>
              <Form.Control
                as="select"
                value={currentDistrict.division_id}
                onChange={(e) => setCurrentDistrict({ ...currentDistrict, division_id: e.target.value })}
              >
                <option value="">Select a division</option>
                {divisions.map(division => (
                  <option key={division.id} value={division.id}>{division.division_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDistrictName">
              <Form.Label>District Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter district name"
                value={currentDistrict.district_name}
                onChange={(e) => setCurrentDistrict({ ...currentDistrict, district_name: e.target.value })}
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

export default District;
