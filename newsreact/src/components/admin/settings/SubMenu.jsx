import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Card, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig'; 
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import { toast } from 'react-toastify';


function SubMenu() {
  const [subMenus, setSubMenus] = useState([]); 
  const [menus, setMenus] = useState([]); // List of menu items for the dropdown
  const [loading, setLoading] = useState(true); 
  const [showModal, setShowModal] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false); 
  const [editSubMenuId, setEditSubMenuId] = useState(null); 

  const initialSubMenuState = {
    name: '',
    link: '',
    menu_id: '', 
    position: '', 
    status: 'active',
  };
  const [newSubMenu, setNewSubMenu] = useState(initialSubMenuState); 

  const tableRef = useRef(null);

  useEffect(() => {
    fetchSubMenus();
    fetchMenus(); // Fetch the parent menus for dropdown

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy(true);
      }
    };
  }, []);

  useEffect(() => {
    if (subMenus.length > 0) {
      $(tableRef.current).DataTable({
        data: subMenus,
        columns: [
          { data: 'id', title: 'ID' },
          { data: 'name', title: 'SubMenu Name' },
          { data: 'menu.name', title: 'Menu Name' }, 
          { data: 'link', title: 'Link' },
          { data: 'status', title: 'Status' },
          { data: 'position', title: 'Position' }, 
          {
            data: null,
            title: 'Actions',
            render: (data) => `
              <button class="btn btn-warning btn-sm edit-btn">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            `,
          },
        ],
        destroy: true,
      });

      $(tableRef.current).on('click', '.edit-btn', function () {
        const data = $(tableRef.current).DataTable().row($(this).parents('tr')).data();
        handleEdit(data);
      });

      $(tableRef.current).on('click', '.delete-btn', function () {
        const data = $(tableRef.current).DataTable().row($(this).parents('tr')).data();
        handleDelete(data.id);
      });
    }
  }, [subMenus]);

  const fetchSubMenus = () => {
    axios.get('/api/sub-menu')
      .then(response => {
        setSubMenus(response.data.data); 
        setLoading(false); 
      })
      .catch(error => {
        setLoading(false);
        toast.error('Failed to load sub-menus.');
      });
  };

  const fetchMenus = () => {
    axios.get('/api/menu')
      .then(response => {
        setMenus(response.data.data); 
      })
      .catch(error => {
        toast.error('Failed to load menus.');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubMenu({ ...newSubMenu, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      axios.put(`/api/sub-menu/${editSubMenuId}`, newSubMenu)
        .then(response => {
          fetchSubMenus(); 
          resetForm(); 
          setShowModal(false); 
          toastr.success('SubMenu updated successfully!');
        })
        .catch(error => {
          console.error('Error updating submenu:', error);
        });
    } else {
      axios.post('/api/sub-menu', newSubMenu)
        .then(response => {
          fetchSubMenus(); 
          resetForm(); 
          setShowModal(false); 
          toast.success('SubMenu added successfully!');
        })
        .catch(error => {
          toast.error('Failed to add submenu.');
        });
    }
  };

  const resetForm = () => {
    setNewSubMenu(initialSubMenuState); 
    setIsEditMode(false); 
    setEditSubMenuId(null);
  };

  const handleEdit = (subMenu) => {
    setIsEditMode(true);
    setEditSubMenuId(subMenu.id);
    setNewSubMenu({
      name: subMenu.name,
      link: subMenu.link,
      menu_id: subMenu.menu_id,
      position: subMenu.position,
      status: subMenu.status,
    });
    setShowModal(true); 
  };

  const handleDelete = (subMenuId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/sub-menu/${subMenuId}`)
          .then(response => {
            Swal.fire(
              'Deleted!',
              'Your submenu item has been deleted.',
              'success'
            );
            fetchSubMenus(); 
          })
          
      }
    });
  };

  const handleShowModal = () => {
    resetForm(); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    resetForm(); 
    setShowModal(false);
  };

  if (loading) {
    return <p>Loading sub-menus...</p>;
  }

  return (
    <>
      <div className="submenu-settings mt-3">
        <Card>
          <Card.Header>
            <Card.Title className="float-start">Sub Menu Settings</Card.Title>
            <Button className="mb-3 float-end" onClick={handleShowModal}>Add New SubMenu Item</Button>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover ref={tableRef}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>SubMenu Name</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Menu Name</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit SubMenu Item' : 'Add New SubMenu Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>SubMenu Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter submenu name"
                value={newSubMenu.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formLink" className="mt-2">
              <Form.Label>SubMenu Link</Form.Label>
              <div className="input-group">
                <span className="input-group-text">{`${axios.defaults.baseURL}`}</span>
                <Form.Control
                  type="text"
                  name="link"
                  placeholder="Enter submenu link"
                  value={newSubMenu.link}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formMenu" className="mt-2">
              <Form.Label>Menu</Form.Label>
              <Form.Control
                as="select"
                name="menu_id"
                value={newSubMenu.menu_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Menu</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>{menu.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPosition" className="mt-2">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="number"
                name="position"
                placeholder="Enter menu position"
                value={newSubMenu.position}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStatus" className="mt-2">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newSubMenu.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {isEditMode ? 'Update SubMenu' : 'Save SubMenu'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SubMenu;
