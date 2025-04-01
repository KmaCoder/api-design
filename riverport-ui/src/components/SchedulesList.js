import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { getSchedules, deleteSchedule, updateSchedule, createSchedule } from '../services/api';

const SchedulesList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Use useRef to store the interval ID so it persists across renders
  const pollingIntervalId = useRef(null);
  
  // Status options from enum
  const statusOptions = ['scheduled', 'cancelled', 'completed'];

  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
    
    // Set up polling every 2 seconds
    pollingIntervalId.current = setInterval(() => {
      fetchSchedules(false); // silent update (don't show loading indicator)
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      if (pollingIntervalId.current) {
        clearInterval(pollingIntervalId.current);
      }
    };
  }, []);

  const fetchSchedules = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await getSchedules();
      setSchedules(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schedules. Please try again later.');
      console.error(err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(scheduleId);
        setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
      } catch (err) {
        setError('Failed to delete schedule. Please try again later.');
        console.error(err);
      }
    }
  };

  const startEditing = (schedule) => {
    setEditingScheduleId(schedule.id);
    setEditedStatus(schedule.status);
  };

  const cancelEditing = () => {
    setEditingScheduleId(null);
    setEditedStatus('');
  };

  const saveEditing = async (schedule) => {
    try {
      const updatedSchedule = { ...schedule, status: editedStatus };
      await updateSchedule(schedule.id, updatedSchedule);
      
      // Update local state
      setSchedules(schedules.map(s => 
        s.id === schedule.id ? { ...s, status: editedStatus } : s
      ));
      
      // Reset editing state
      setEditingScheduleId(null);
      setEditedStatus('');
    } catch (err) {
      setError('Failed to update schedule. Please try again later.');
      console.error(err);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      // Get tomorrow's date for the example
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString();
      
      // Two hours later for arrival
      const tomorrowPlus2 = new Date(tomorrow);
      tomorrowPlus2.setHours(tomorrowPlus2.getHours() + 2);
      const tomorrowPlus2Str = tomorrowPlus2.toISOString();
      
      // Hardcoded data for new schedule
      const newScheduleData = {
        routeId: "example-route-id",
        boatId: "example-boat-id",
        departureTime: tomorrowStr,
        arrivalTime: tomorrowPlus2Str,
        status: "scheduled"
      };
      
      const createdSchedule = await createSchedule(newScheduleData);
      setSchedules([...schedules, createdSchedule]);
      setShowCreateModal(false);
    } catch (err) {
      setError('Failed to create schedule. Please try again later.');
      console.error(err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && schedules.length === 0) return <div>Loading schedules...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Schedules</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create New Schedule
        </Button>
      </div>
      
      {schedules.length === 0 ? (
        <p>No schedules found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Route ID</th>
              <th>Boat ID</th>
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.routeId}</td>
                <td>{schedule.boatId || 'Not assigned'}</td>
                <td>{formatDate(schedule.departureTime)}</td>
                <td>{formatDate(schedule.arrivalTime)}</td>
                <td>
                  {editingScheduleId === schedule.id ? (
                    <Form.Select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)
                  )}
                </td>
                <td>
                  {editingScheduleId === schedule.id ? (
                    <>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => saveEditing(schedule)}
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
                        onClick={() => startEditing(schedule)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
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

      {/* Create Schedule Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This will create a new schedule with the following hardcoded data:</p>
          <pre>
            {JSON.stringify({
              routeId: "example-route-id",
              boatId: "example-boat-id",
              departureTime: "Tomorrow",
              arrivalTime: "Tomorrow + 2 hours",
              status: "scheduled"
            }, null, 2)}
          </pre>
          <p className="text-muted">Note: You may need to update with valid IDs from your database.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateSchedule}>
            Create Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SchedulesList; 