import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function AuthRole() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    axios.get('/api/roles/')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
      });
  };

  const handleShowRoleModal = () => setShowRoleModal(true);
  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setRoleName('');
    setEditMode(false);
    setCurrentRoleId(null);
  };

  const handleSaveRole = () => {
    if (roleName.trim() === '') {
      toast.error('Role name is required');
      return;
    }

    const requestData = { name: roleName };

    if (editMode) {
      axios.put(`/api/roles/${currentRoleId}`, requestData)
        .then((response) => {
          if (response.data.success) {
            setRoles(roles.map(role =>
              role.id === currentRoleId ? response.data.data : role
            ));
            toast.success(response.data.message);
            handleCloseRoleModal();
          } else {
            toast.error('Error updating role');
          }
        })
        .catch((error) => {
          console.error('Error updating role:', error);
          toast.error('Error updating role');
        });
    } else {
      axios.post('/api/roles/', requestData)
        .then((response) => {
          if (response.data.success) {
            setRoles([...roles, response.data.data]);
            toast.success(response.data.message);
            handleCloseRoleModal();
          } else {
            toast.error('Error creating role');
          }
        })
        .catch((error) => {
          console.error('Error creating role:', error);
          toast.error('Error creating role');
        });
    }
  };

  const handleEditRole = (role) => {
    setCurrentRoleId(role.id);
    setRoleName(role.name);
    setEditMode(true);
    setShowRoleModal(true);
  };

  const handleDeleteRole = (roleId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this role!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/roles/${roleId}`)
          .then((response) => {
            if (response.data.success) {
              setRoles(roles.filter(role => role.id !== roleId));
              toast.success('Role deleted successfully');
            } else {
              toast.error('Error deleting role');
            }
          })
          .catch((error) => {
            console.error('Error deleting role:', error);
            toast.error('Error deleting role');
          });
      }
    });
  };

  const handleShowPermissions = (role) => {
    setCurrentRoleId(role.id);
    setRoleName(role.name);
    setShowPermissionsModal(true);
  
    axios.get(`/api/roles/${role.id}/permissions`)
      .then((response) => {
        if (response.data.success) {
          setPermissions(response.data.data.all_permissions);
          setSelectedPermissions(response.data.data.assigned_permissions);
        } else {
          toast.error('Error fetching permissions');
        }
      })
      .catch((error) => {
        console.error('Error fetching permissions:', error);
        toast.error('Error fetching permissions');
      });
  };
  
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionId)
        ? prevSelected.filter((id) => id !== permissionId)
        : [...prevSelected, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (selectedPermissions.length === 0) {
      toast.error('No permissions selected');
      return;
    }

    axios.post(`/api/roles/${currentRoleId}/permissions`, { permission_ids: selectedPermissions })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          handleClosePermissionsModal();
        } else {
          toast.error('Error assigning permissions');
        }
      })
      .catch((error) => {
        console.error('Error assigning permissions:', error);
        toast.error('Error assigning permissions');
      });
  };

  const handleClosePermissionsModal = () => {
    setShowPermissionsModal(false);
    setSelectedPermissions([]);
  };

  return (
    <div className='mt-3'>
      <Card>
        <Card.Header>
          <Card.Title className='float-start'>User Roles with Permissions</Card.Title>
          <Button className='float-end' onClick={handleShowRoleModal}>Add New Role</Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>SL</th>
                <th style={{ width: '10%' }}>Role ID</th>
                <th style={{ width: '15%' }}>Role Name</th>
                <th style={{ width: '55%' }} className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={role.id}>
                  <td>{index + 1}</td>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td className='text-center'>
                    <Button className='btn btn-primary' onClick={() => handleEditRole(role)}>Edit</Button>
                    <Button className='btn btn-success ms-2 me-2' onClick={() => handleShowPermissions(role)}>Give Permissions</Button>
                    <Button className='btn btn-danger' onClick={() => handleDeleteRole(role.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Role Modal */}
      <Modal show={showRoleModal} onHide={handleCloseRoleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Role' : 'Add New Role'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formRoleName">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRoleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveRole}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Permissions Modal */}
      <Modal show={showPermissionsModal} onHide={handleClosePermissionsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Permissions to Role: {roleName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Permissions</Form.Label>
              {permissions.map((permission) => (
                <Form.Check
                  type="checkbox"
                  key={permission.id}
                  label={permission.name}
                  value={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => handlePermissionChange(permission.id)}
                />
              ))}

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePermissionsModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSavePermissions}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AuthRole;
