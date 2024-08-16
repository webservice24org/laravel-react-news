import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';

function District() {
  const [districts, setDistricts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState({ id: null, division_id: '', district_name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchDistricts();
    fetchDivisions();
  }, []);

  useEffect(() => {
    // Cleanup previous DataTable instance if any
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    // Initialize DataTable after districts data is set
    if (districts.length > 0) {
      $(tableRef.current).DataTable({
        data: districts.map((district, index) => [
          index + 1,
          divisions.find(division => division.id === district.division_id)?.division_name || 'N/A',
          district.district_name,
          district.id // for actions
        ]),
        columns: [
          { title: "SL" },
          { title: "Division Name" },
          { title: "District Name" },
          {
            title: "Actions",
            orderable: false,
            render: function (data, type, row) {
              return `
                <button class="btn btn-primary me-1 edit-btn" data-id="${row[3]}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${row[3]}">Delete</button>
              `;
            }
          }
        ],
        responsive: true
      });

      // Attach event listeners for edit and delete buttons
      $(tableRef.current).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const district = districts.find(d => d.id === id);
        if (district) {
          handleEdit(district);
        }
      });

      $(tableRef.current).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        handleDelete(id);
      });
    }

    // Cleanup DataTable on component unmount
    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().clear().destroy();
      }
    };
  }, [districts, divisions]);

  const fetchDistricts = (divisionId = '') => {
    let url = '/api/districts/';
    if (divisionId) {
      url += `?division_id=${divisionId}`;
    }

    axios.get(url)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setDistricts(response.data.data);
        } else {
          toast.error('Unexpected response structure');
        }
      })
      .catch((error) => {
        toast.error('Error fetching Districts');
      });
  };

  const fetchDivisions = () => {
    axios.get('/api/divisions/')
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setDivisions(response.data.data);
        } else {
          toast.error('Unexpected response structure');
        }
      })
      .catch((error) => {
        toast.error('Error fetching Divisions');
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
        .then(() => {
          toast.success('District updated successfully');
          fetchDistricts();
          handleCloseModal();
        })
        .catch(() => {
          toast.error('Error updating district');
        });
    } else {
      axios.post('/api/districts/', {
        division_id: currentDistrict.division_id,
        district_name: currentDistrict.district_name
      })
        .then(() => {
          toast.success('District created successfully');
          fetchDistricts();
          handleCloseModal();
        })
        .catch(() => {
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
          .catch(() => {
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
          <Table striped bordered hover responsive ref={tableRef}>
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
                    <td>{divisions.find(division => division.id === district.division_id)?.division_name || 'N/A'}</td>
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
