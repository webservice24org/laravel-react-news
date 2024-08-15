import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryData, setCategoryData] = useState({ id: '', category_name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('/api/categories/')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleShowModal = (category = { id: '', category_name: '', description: '' }, editMode = false) => {
    setCategoryData(category);
    setIsEdit(editMode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCategoryData({ id: '', category_name: '', description: '' });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleSaveCategory = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/categories/${categoryData.id}`, categoryData);
        toast.success('Category updated successfully.');
      } else {
        await axios.post('/api/categories', categoryData);
        toast.success('Category created successfully.');
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save category.');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/categories/${categoryId}`);
          toast.success('Category deleted successfully.');
          fetchCategories();
        } catch (error) {
          toast.error('Failed to delete category.');
        }
      }
    });
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>Categories</Card.Title>
          <Button className='float-end' onClick={() => handleShowModal()}>Add New Category</Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>SL</th>
                <th style={{ width: '25%' }}>Category Name</th>
                <th style={{ width: '50%' }}>Description</th>
                <th style={{ width: '20%' }} className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.id}>
                  <td>{index + 1}</td>
                  <td>{category.category_name}</td>
                  <td>{category.description}</td>
                  <td className='text-center'>
                    <Button className='btn btn-primary me-1' onClick={() => handleShowModal(category, true)}>Edit</Button>
                    <Button className='btn btn-danger' onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter category name'
              name='category_name'
              value={categoryData.category_name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as='textarea'
              rows={3} // Optional: Specifies the number of visible text lines
              placeholder='Enter description'
              name='description'
              value={categoryData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSaveCategory}>
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CategoryManagement;
