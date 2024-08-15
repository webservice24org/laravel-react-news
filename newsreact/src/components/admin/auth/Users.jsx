import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig'; 
import { toast } from 'react-toastify';

function Users() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    userPasswordConfirmation: '',
    userRole: '',
  });
  const [editingUser, setEditingUser] = useState(null); 

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/user/roles-permissions');
      if (response.data.success) {
        setUsers(response.data.data);
        setLoading(false);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('An error occurred while fetching users');
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles/');
      if (response.data.success) {
        setRoles(response.data.data);
      } else {
        toast.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('An error occurred while fetching roles');
    }
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setFormData({
        userName: user.name,
        userEmail: user.email,
        userPassword: '',
        userPasswordConfirmation: '',
        userRole: user.roles[0]?.id || '',
      });
      setEditingUser(user);
    } else {
      setFormData({
        userName: '',
        userEmail: '',
        userPassword: '',
        userPasswordConfirmation: '',
        userRole: '',
      });
      setEditingUser(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      userName: '',
      userEmail: '',
      userPassword: '',
      userPasswordConfirmation: '',
      userRole: '',
    });
    setEditingUser(null);
  };

  const handleBlockUnblockUser = async (userId, shouldBlock) => {
    try {
      const response = await axios.put(`/api/user/block-unblock/${userId}`, {
        blocked: shouldBlock,
      });
  
      if (response.data.success) {
        toast.success(shouldBlock ? 'User blocked successfully' : 'User unblocked successfully');
        fetchUsers(); 
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      toast.error('An error occurred while updating the user status');
    }
  };

  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async () => {
    if (formData.userPassword !== formData.userPasswordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const requestData = {
        name: formData.userName,
        email: formData.userEmail,
        password: formData.userPassword || undefined,
        password_confirmation: formData.userPasswordConfirmation || undefined,
        role_id: formData.userRole,
      };

      let response;
      if (editingUser) {
        response = await axios.put(`/api/auth/register/${editingUser.id}`, requestData);
      } else {
        response = await axios.post('/api/auth/register', requestData);
      }

      if (response.data.success) {
        toast.success(editingUser ? 'User updated successfully' : 'User registered successfully');
        fetchUsers(); 
        handleCloseModal();
      } else {
        toast.error('Failed to submit user data');
      }
    } catch (error) {
      console.error('Error submitting user data:', error);
      toast.error('An error occurred while submitting the user data');
    }
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>User List</Card.Title>
          <Button className='float-end' onClick={() => handleShowModal()}>
            Add New User
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>SL</th>
                  <th style={{ width: '15%' }}>User Name</th>
                  <th style={{ width: '15%' }}>Email</th>
                  <th style={{ width: '7%' }}>User Role</th>
                  <th style={{ width: '43%' }}>Permissions</th>
                  <th style={{ width: '15%' }} className='text-center'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.user.id}>
                    <td>{index + 1}</td>
                    <td>{user.user.name}</td>
                    <td>{user.user.email}</td>
                    <td>{user.roles.map((role) => role.name).join(', ')}</td>
                    <td>
                      {user.permissions.length > 0
                        ? user.permissions.map((perm) => perm.name).join(', ')
                        : 'No Permissions'}
                    </td>
                    <td className='text-center'>
                      <Button className='btn btn-primary me-1' onClick={() => handleShowModal(user.user)}>
                        Edit
                      </Button>
                      <Button 
                        className={`btn ${user.user.blocked ? 'btn-success' : 'btn-warning'}`}
                        onClick={() => handleBlockUnblockUser(user.user.id, !user.user.blocked)}
                      >
                        {user.user.blocked ? 'Unblock' : 'Block'}
                    </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3' controlId='userName'>
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter User name'
                    value={formData.userName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='mb-3' controlId='userEmail'>
                  <Form.Label>User Email</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter User email'
                    value={formData.userEmail}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3' controlId='userPassword'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={formData.userPassword}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='mb-3' controlId='userPasswordConfirmation'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={formData.userPasswordConfirmation}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <Form.Group className='mb-3' controlId='userRole'>
                  <Form.Label>Select User Role</Form.Label>
                  <Form.Select value={formData.userRole} onChange={handleInputChange}>
                    <option value=''>Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant='primary' onClick={handleFormSubmit}>
            {editingUser ? 'Update User' : 'Save User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users;
