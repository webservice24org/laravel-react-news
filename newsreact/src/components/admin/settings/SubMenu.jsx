import React from 'react';
import { Table, Button, Card } from 'react-bootstrap';

function SubMenu() {
  return (
    <>
      <div className="menu-settings">
        <Card>
          <Card.Header>
            <Card.Title className="float-start">Sub Menu Settings</Card.Title>
            <Button className="mb-3 float-end">Add New Sub Menu Item</Button>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Link</th>
                  <th>Main Menu Name</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default SubMenu;
