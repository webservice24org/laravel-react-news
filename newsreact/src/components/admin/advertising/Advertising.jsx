import React, { useState, useEffect } from 'react';
import axios from '/axiosConfig'; // Adjust the import path as needed
import { toast } from 'react-toastify';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Advertising() {
  const [advertisements, setAdvertisements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    advert_image: null,
    advert_image_preview: null,
    code: '',
    status: false,
    advert_image_old: '' // Hidden field for old image filename
  });

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get('/api/advertising');
      setAdvertisements(response.data);
    } catch (error) {
      console.error("There was an error fetching the advertising data!", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        advert_image: file,
        advert_image_preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('code', formData.code);
    formPayload.append('status', formData.status ? '1' : '0'); // Convert checkbox value to a string
    
    if (formData.advert_image) {
      formPayload.append('advert_image', formData.advert_image);
    }
    
    if (isEditing && formData.advert_image_old) {
      formPayload.append('advert_image_old', formData.advert_image_old);
    }
  
    try {
      const url = isEditing ? `/api/advertising/${formData.id}` : '/api/advertising';
      const method = isEditing ? 'post' : 'post'; // This should be 'put' for editing
      
      await axios({
        method: method,
        url: url,
        data: formPayload,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      toast.success(`${isEditing ? "Advertisement updated" : "Advertisement created"} successfully!`);
      fetchAdvertisements(); // Refresh the list of advertisements
      handleCloseModal(); // Close the form modal
    } catch (error) {
      toast.error(`${isEditing ? "Error updating" : "Error creating"} advertisement.`);
      console.error(`Error ${isEditing ? "updating" : "creating"} the advertisement!`, error);
    }
  };
  

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/advertising/${id}`)
          .then(response => {
            setAdvertisements(advertisements.filter(ad => ad.id !== id));
            Swal.fire('Deleted!', 'Advertisement has been deleted.', 'success');
          })
          .catch(error => {
            console.error("There was an error deleting the advertisement!", error);
            Swal.fire('Error!', 'Error deleting advertisement.', 'error');
          });
      }
    });
  };

  const handleEdit = (ad) => {
    setFormData({
      id: ad.id,
      title: ad.title,
      advert_image: null,
      advert_image_preview: `${axios.defaults.baseURL}storage/advertising/${ad.advert_image}`, // Set preview URL for old image
      code: ad.code,
      status: ad.status,
      advert_image_old: ad.advert_image // Set old image filename
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleShowModal = () => {
    setFormData({
      id: null,
      title: '',
      advert_image: null,
      advert_image_preview: null,
      code: '',
      status: false,
      advert_image_old: '' // Reset old image filename
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <Card className='mt-3'>
      <Card.Header>
        <h2 className='float-start'>Advertising Management</h2>
        <Button className='float-end' onClick={handleShowModal}>Add New Advertise</Button>
      </Card.Header>
      <Card.Body>
        <Table className='table table-bordered table-striped'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Advert Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {advertisements.length > 0 ? (
              advertisements.map((ad) => (
                <tr key={ad.id}>
                  <td>{ad.id}</td>
                  <td>{ad.title}</td>
                  <td>
                    {ad.advert_image ? (
                      <img
                        src={`${axios.defaults.baseURL}storage/advertising/${ad.advert_image}`}
                        alt={ad.title}
                        style={{ width: '100px' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{ad.status ? 'Published' : 'Pending'}</td>
                  <td>
                    <Button className='btn btn-primary me-1' onClick={() => handleEdit(ad)}>Edit</Button>
                    <Button className='btn btn-danger' onClick={() => handleDelete(ad.id)}>Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No advertisements found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      {/* Modal for Add/Edit Advertisement */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Advertisement' : 'Add New Advertisement'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
          <input type="hidden" name="id" value={formData} />
            <Form.Group className='mb-3'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Advert Image</Form.Label>
              <Form.Control
                type='file'
                name='advert_image'
                onChange={handleFileChange}
              />
              {formData.advert_image_preview && (
                <div className='mt-3'>
                  <img
                    src={formData.advert_image_preview}
                    alt='Preview'
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              )}
              {formData.advert_image && isEditing && formData.advert_image_old && (
                <div className='mt-3'>
                  <img
                    src={`${axios.defaults.baseURL}storage/advertising/${formData.advert_image_old}`}
                    alt='Existing'
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Code</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                name='code'
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Status</Form.Label>
              <Form.Check
                type='checkbox'
                label='Published'
                name='status'
                checked={formData.status || false}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              />
            </Form.Group>


            <Button variant='primary' type='submit'>
              {isEditing ? 'Update' : 'Submit'}
            </Button>
            <Button variant='secondary' onClick={handleCloseModal} className='ms-2'>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default Advertising;
