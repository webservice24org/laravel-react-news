import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';

function SubCategoryManagement() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState({ id: '', category_id: '', sub_category_name: '', description: '' });
  const tableRef = useRef(null);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    
    if (subCategories.length > 0) {
      $(tableRef.current).DataTable({
        data: subCategories.map((subCategory, index) => [
          subCategory.id,
          categories.find(category => category.id === subCategory.category_id)?.category_name || 'N/A',
          subCategory.sub_category_name,
          subCategory.description,
          subCategory.id 
        ]),
        columns: [
          { title: "ID" },
          { title: "Category" },
          { title: "Sub-Category Name" },
          { title: "Description" },
          {
            title: "Actions",
            orderable: false,
            render: function (data, type, row) {
              return `
                <button class="btn btn-primary me-1 edit-btn" data-id="${row[4]}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${row[4]}">Delete</button>
              `;
            }
          }
        ],
        responsive: true
      });

      $(tableRef.current).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const subCategory = subCategories.find(sc => sc.id === id);
        if (subCategory) {
          handleShowModal(subCategory, true);
        }
      });

      $(tableRef.current).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        handleDeleteSubCategory(id);
      });
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().clear().destroy();
      }
    };
  }, [subCategories, categories]);

  const fetchSubCategories = (categoryId = '') => {
    let url = '/api/sub-categories/';
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }

    axios.get(url)
      .then((response) => {
        console.log('Fetched Sub-Categories:', response.data); 
        if (Array.isArray(response.data.data)) {
          setSubCategories(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        toast.error('Error fetching Sub-Categories');
      });
  };

  const fetchCategories = () => {
    axios.get('/api/categories/')
      .then((response) => {
        console.log('Fetched Categories:', response.data); 
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching Categories:', error); 
        toast.error('Error fetching Categories');
      });
  };

  const handleShowModal = (subCategory = { id: '', category_id: '', sub_category_name: '', description: '' }, editMode = false) => {
    setSubCategoryData(subCategory);
    setIsEdit(editMode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSubCategoryData({ id: '', category_id: '', sub_category_name: '', description: '' });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setSubCategoryData({ ...subCategoryData, [e.target.name]: e.target.value });
  };

  const handleSaveSubCategory = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/sub-categories/${subCategoryData.id}`, subCategoryData);
        toast.success('Sub-Category updated successfully.');
      } else {
        await axios.post('/api/sub-categories', subCategoryData);
        toast.success('Sub-Category created successfully.');
      }
      fetchSubCategories();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save Sub-Category.');
    }
  };

  const handleDeleteSubCategory = (subCategoryId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/sub-categories/${subCategoryId}`);
          toast.success('Sub-Category deleted successfully.');
          fetchSubCategories();
        } catch (error) {
          toast.error('Failed to delete Sub-Category.');
        }
      }
    });
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>Sub-Categories</Card.Title>
          <Button className='float-end' onClick={() => handleShowModal()}>Add New Sub-Category</Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive ref={tableRef}>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>ID</th>
                <th style={{ width: '20%' }}>Category</th>
                <th style={{ width: '20%' }}>Sub-Category Name</th>
                <th style={{ width: '40%' }}>Description</th>
                <th style={{ width: '15%' }} className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.length > 0 ? (
                subCategories.map((subCategory, index) => (
                  <tr key={subCategory.id}>
                    <td>{subCategory.id}</td>
                    <td>{categories.find(category => category.id === subCategory.category_id)?.category_name}</td>
                    <td>{subCategory.sub_category_name}</td>
                    <td>{subCategory.description}</td>
                    <td className='text-center'>
                      <Button className='btn btn-primary me-1' onClick={() => handleShowModal(subCategory, true)}>Edit</Button>
                      <Button className='btn btn-danger' onClick={() => handleDeleteSubCategory(subCategory.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No sub-categories found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Sub-Category' : 'Add Sub-Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                name='category_id'
                value={subCategoryData.category_id}
                onChange={handleInputChange}
              >
                <option value=''>Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Sub-Category Name</Form.Label>
              <Form.Control
                type='text'
                name='sub_category_name'
                value={subCategoryData.sub_category_name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                name='description'
                value={subCategoryData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>Close</Button>
          <Button variant='primary' onClick={handleSaveSubCategory}>
            {isEdit ? 'Save Changes' : 'Save Sub-Category'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SubCategoryManagement;
