import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Card, Modal, Form } from 'react-bootstrap';
import axios from '/axiosConfig'; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; 
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';

function Menu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // For view modal
  const [subMenus, setSubMenus] = useState([]); // To store sub-menu items
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMenuId, setEditMenuId] = useState(null);
  const [menuName, setMenuName] = useState(''); // State to hold the menu name


  const initialMenuState = {
    name: '',
    link: '',
    position: '',
    status: 'active',
  };
  const [newMenu, setNewMenu] = useState(initialMenuState);

  const tableRef = useRef(null);

  useEffect(() => {
    fetchMenus();
    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy(true);
      }
    };
  }, []);

  useEffect(() => {
    if (menus.length > 0) {
      $(tableRef.current).DataTable({
        data: menus,
        columns: [
          { data: 'id', title: 'ID' },
          { data: 'name', title: 'Name' },
          { data: 'link', title: 'Link' },
          { data: 'status', title: 'Status' },
          { data: 'position', title: 'Position' },
          {
            data: null,
            title: 'Actions',
            render: (data) => `
              <button class="btn btn-warning btn-sm edit-btn">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn">Delete</button>
              <button class="btn btn-primary btn-sm view-btn">View</button>
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

      $(tableRef.current).on('click', '.view-btn', function () {
        const data = $(tableRef.current).DataTable().row($(this).parents('tr')).data();
        handleView(data.id); // Fetch sub-menu items
      });
    }
  }, [menus]);

  const fetchMenus = () => {
    axios.get('/api/menu/')
      .then(response => {
        setMenus(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching menu data:', error);
        setLoading(false);
      });
  };

  const handleView = async (menuId) => {
    try {
      const response = await axios.get(`/api/menu/${menuId}/sub-menus`);
      const data = response.data;
      if (data.success) {
        setSubMenus(data.sub_menus); // Set the sub-menu items
        setMenuName(data.menu); // Set the menu name
        setShowViewModal(true); // Show the modal
      }
    } catch (error) {
      console.error("Error fetching sub-menu items:", error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenu({ ...newMenu, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      axios.put(`/api/menu/${editMenuId}`, newMenu)
        .then(response => {
          fetchMenus();
          resetForm();
          setShowModal(false);
          toast.success('Menu updated successfully!');
        })
        .catch(error => {
          console.error('Error updating menu:', error);
        });
    } else {
      axios.post('/api/menu/', newMenu)
        .then(response => {
          fetchMenus();
          resetForm();
          setShowModal(false);
          toast.success('Menu Added successfully.');
        })
        .catch(error => {
          console.error('Error adding menu:', error);
        });
    }
  };

  const resetForm = () => {
    setNewMenu(initialMenuState);
    setIsEditMode(false);
    setEditMenuId(null);
  };

  const handleEdit = (menu) => {
    setIsEditMode(true);
    setEditMenuId(menu.id);
    setNewMenu({
      name: menu.name,
      link: menu.link,
      position: menu.position,
      status: menu.status,
    });
    setShowModal(true);
  };

  const handleDelete = (menuId) => {
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
        axios.delete(`/api/menu/${menuId}`)
          .then(response => {
            Swal.fire(
              'Deleted!',
              'Your menu item has been deleted.',
              'success'
            );
            fetchMenus();
          })
          .catch(error => {
            Swal.fire(
              'Error!',
              'An error occurred while deleting the menu item.',
              'error'
            );
            console.error('Error deleting menu:', error);
          });
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

  const handleCloseViewModal = () => {
    setShowViewModal(false); // Close view modal
  };

  if (loading) {
    return <p>Loading menus...</p>;
  }

  return (
    <>
      <div className="menu-settings mt-3">
        <Card>
          <Card.Header>
            <Card.Title className="float-start">Main Menu Settings</Card.Title>
            <Button className="mb-3 float-end" onClick={handleShowModal}>Add New Menu Item</Button>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover ref={tableRef}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Link</th>
                  <th>Status</th>
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

      {/* Modal for Add/Edit Menu */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter menu name"
                value={newMenu.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formLink" className="mt-2">
              <Form.Label>Menu Link</Form.Label>
              <div className="input-group">
                <span className="input-group-text">{`${axios.defaults.baseURL}`}</span>
                <Form.Control
                  type="text"
                  name="link"
                  placeholder="Enter menu link"
                  value={newMenu.link}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formPosition" className="mt-2">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="number"
                name="position"
                placeholder="Enter menu position"
                value={newMenu.position}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStatus" className="mt-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={newMenu.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {isEditMode ? 'Update Menu Item' : 'Add Menu Item'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Viewing Sub-Menus */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sub-Menu Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h5>{menuName}</h5>
          {subMenus.length > 0 ? (
            <ul>
              {subMenus.map((subMenu) => (
                <li key={subMenu.id}>{subMenu.name}</li>
              ))}
            </ul>
          ) : (
            <p>No sub-menu items found for this menu.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Menu;
