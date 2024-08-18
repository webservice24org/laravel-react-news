import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';

function TagManagement() {
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [tagData, setTagData] = useState({ id: '', tag_name: '' });
  const tableRef = useRef(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    if (tags.length > 0) {
      $(tableRef.current).DataTable({
        data: tags.map((tag, index) => [
          index + 1,
          tag.tag_name,
          tag.id
        ]),
        columns: [
          { title: "SL" },
          { title: "Tag Name" },
          {
            title: "Actions",
            orderable: false,
            render: function (data, type, row) {
              return `
                <button class="btn btn-primary me-1 edit-btn" data-id="${row[2]}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${row[2]}">Delete</button>
              `;
            }
          }
        ],
        responsive: true
      });

      $(tableRef.current).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const tag = tags.find(t => t.id === id);
        if (tag) {
          handleShowModal(tag, true);
        }
      });

      $(tableRef.current).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        handleDeleteTag(id);
      });
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().clear().destroy();
      }
    };
  }, [tags]);

  const fetchTags = () => {
    axios.get('/api/tags/')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTags(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setTags(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching tags:', error);
        toast.error('Error fetching tags');
      });
  };

  const handleShowModal = (tag = { id: '', tag_name: '' }, editMode = false) => {
    setTagData(tag);
    setIsEdit(editMode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setTagData({ id: '', tag_name: '' });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setTagData({ ...tagData, [e.target.name]: e.target.value });
  };

  const handleSaveTag = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/tags/${tagData.id}`, tagData);
        toast.success('Tag updated successfully.');
      } else {
        await axios.post('/api/tags', tagData);
        toast.success('Tag created successfully.');
      }
      fetchTags();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save tag.');
    }
  };

  const handleDeleteTag = (tagId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/tags/${tagId}`);
          toast.success('Tag deleted successfully.');
          fetchTags();
        } catch (error) {
          toast.error('Failed to delete tag.');
        }
      }
    });
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>Tags</Card.Title>
          <Button className='float-end' onClick={() => handleShowModal()}>Add New Tag</Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive ref={tableRef}>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>SL</th>
                <th style={{ width: '45%' }}>Tag Name</th>
                <th style={{ width: '50%' }} className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* DataTables will handle rendering */}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Tag' : 'Add Tag'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Tag Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter tag name'
                name='tag_name'
                value={tagData.tag_name}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSaveTag}>
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TagManagement;
