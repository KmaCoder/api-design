import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { getRoutes, deleteRoute, updateRoute, createRoute } from '../services/api';

const RoutesList = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Use useRef to store the interval ID so it persists across renders
  const pollingIntervalId = useRef(null);
  
  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
    
    // Set up polling every 2 seconds
    pollingIntervalId.current = setInterval(() => {
      fetchRoutes(false); // silent update (don't show loading indicator)
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      if (pollingIntervalId.current) {
        clearInterval(pollingIntervalId.current);
      }
    };
  }, []);

  const fetchRoutes = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await getRoutes();
      setRoutes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch routes. Please try again later.');
      console.error(err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await deleteRoute(routeId);
        setRoutes(routes.filter(route => route.id !== routeId));
      } catch (err) {
        setError('Failed to delete route. Please try again later.');
        console.error(err);
      }
    }
  };

  const startEditing = (route) => {
    setEditingRouteId(route.id);
    setEditedName(route.name);
  };

  const cancelEditing = () => {
    setEditingRouteId(null);
    setEditedName('');
  };

  const saveEditing = async (route) => {
    try {
      const updatedRoute = { ...route, name: editedName };
      await updateRoute(route.id, updatedRoute);
      
      // Update local state
      setRoutes(routes.map(r => 
        r.id === route.id ? { ...r, name: editedName } : r
      ));
      
      // Reset editing state
      setEditingRouteId(null);
      setEditedName('');
    } catch (err) {
      setError('Failed to update route. Please try again later.');
      console.error(err);
    }
  };

  const handleCreateRoute = async () => {
    try {
      // Hardcoded data for new route
      const newRouteData = {
        name: "New Route",
        startLocation: "Start Port",
        endLocation: "End Port",
        distance: 10.5
      };
      
      const createdRoute = await createRoute(newRouteData);
      setRoutes([...routes, createdRoute]);
      setShowCreateModal(false);
    } catch (err) {
      setError('Failed to create route. Please try again later.');
      console.error(err);
    }
  };

  if (loading && routes.length === 0) return <div>Loading routes...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Routes</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create New Route
        </Button>
      </div>
      
      {routes.length === 0 ? (
        <p>No routes found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Distance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>
                  {editingRouteId === route.id ? (
                    <Form.Control
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    route.name
                  )}
                </td>
                <td>{route.startLocation}</td>
                <td>{route.endLocation}</td>
                <td>{route.distance}</td>
                <td>
                  {editingRouteId === route.id ? (
                    <>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => saveEditing(route)}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="info" 
                        size="sm" 
                        className="me-2"
                        onClick={() => startEditing(route)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(route.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Route Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Route</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This will create a new route with the following hardcoded data:</p>
          <pre>
            {JSON.stringify({
              name: "New Route",
              startLocation: "Start Port",
              endLocation: "End Port",
              distance: 10.5
            }, null, 2)}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateRoute}>
            Create Route
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoutesList; 