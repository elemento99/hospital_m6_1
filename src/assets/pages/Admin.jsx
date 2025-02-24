import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { useHospital } from '../../context/HospitalContext';

const Admin = () => {
  const { doctors, services, getDoctors, getServices } = useHospital();
  const [medicalTeams, setMedicalTeams] = useState([]);
  const [newMedicalTeam, setNewMedicalTeam] = useState({ name: '', specialty: '', years_experience: '' });
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    doctor_id: '',
    patient_name: '',
    service_id: '',
    appointment_date: '',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicalTeams();
    fetchAppointments();
    getDoctors();
    getServices();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchMedicalTeams = async () => {
    try {
      const response = await fetch('/api/doctors', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setMedicalTeams(data || []);
    } catch (error) {
      console.error('Error fetching medical teams:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
    }
  };

  const handleAddMedicalTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newMedicalTeam)
      });
      if (!response.ok) throw new Error('Failed to add doctor');
      const data = await response.json();
      setMedicalTeams([...medicalTeams, data]);
      setNewMedicalTeam({ name: '', specialty: '', years_experience: '' });
    } catch (error) {
      console.error('Error adding medical team:', error);
      setError(error.message);
    }
  };

  const handleDeleteMedicalTeam = async (id) => {
    try {
      const response = await fetch(`/api/admin/doctors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete doctor');
      setMedicalTeams(medicalTeams.filter(team => team.id !== id));
    } catch (error) {
      console.error('Error deleting medical team:', error);
      setError(error.message);
    }
  };

  const handleEditDoctorClick = (doctor) => {
    setEditingDoctor({ ...doctor });
    setShowEditDoctorModal(true);
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;

    try {
      const response = await fetch(`/api/admin/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: editingDoctor.name,
          specialty: editingDoctor.specialty,
          years_experience: editingDoctor.years_experience
        })
      });
      if (!response.ok) throw new Error('Failed to update doctor');
      const updatedDoctor = await response.json();
      setMedicalTeams(medicalTeams.map((team) =>
        team.id === updatedDoctor.id ? updatedDoctor : team
      ));
      setShowEditDoctorModal(false);
      setEditingDoctor(null);
    } catch (error) {
      console.error('Error updating doctor:', error);
      setError(error.message);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newAppointment),
      });
      if (!response.ok) throw new Error('Failed to add appointment');
      const data = await response.json();
      setAppointments([...appointments, data]);
      setNewAppointment({
        doctor_id: '',
        patient_name: '',
        service_id: '',
        appointment_date: '',
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
      setError(error.message);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError(error.message);
    }
  };

  const handleEditAppointmentClick = (appointment) => {
    setEditingAppointment({ ...appointment });
    setShowEditAppointmentModal(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    try {
      const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAppointment),
      });
      const updatedAppointment = await response.json();
      setAppointments(appointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      ));
      setShowEditAppointmentModal(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Admin Panel</h1>

      <section className="mb-5">
        <h2>Medical Teams</h2>
        <Form className="mb-3" onSubmit={handleAddMedicalTeam}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Name"
                value={newMedicalTeam.name}
                onChange={(e) => setNewMedicalTeam({ ...newMedicalTeam, name: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Specialty"
                value={newMedicalTeam.specialty}
                onChange={(e) => setNewMedicalTeam({ ...newMedicalTeam, specialty: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Years of Experience"
                value={newMedicalTeam.years_experience}
                onChange={(e) => setNewMedicalTeam({ ...newMedicalTeam, years_experience: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Button type="submit" variant="primary">
                Add Medical Team
              </Button>
            </Col>
          </Row>
        </Form>
        <ListGroup>
          {medicalTeams.map((team) => (
            <ListGroup.Item key={team.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{team.name}</strong>
                <br />
                <small>Specialty: {team.specialty}</small>
                <br />
                <small>Experience: {team.years_experience} years</small>
              </div>
              <div>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditDoctorClick(team)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteMedicalTeam(team.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </section>

      <section className="mb-5">
        <h2>Add Appointments</h2>
        <Form onSubmit={handleAddAppointment}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Patient Name"
                value={newAppointment.patient_name}
                onChange={(e) => setNewAppointment({ ...newAppointment, patient_name: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Form.Select
                value={newAppointment.doctor_id}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                value={newAppointment.service_id}
                onChange={(e) => setNewAppointment({ ...newAppointment, service_id: e.target.value })}
                required
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Control
                type="date"
                value={newAppointment.appointment_date}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Button type="submit" variant="primary">
                Add Appointment
              </Button>
            </Col>
          </Row>
        </Form>
      </section>

      <section>
        <h2>Manage Appointments</h2>
        <ListGroup>
          {appointments.map((appointment) => (
            <ListGroup.Item key={appointment.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Patient: {appointment.patient_name}</strong>
                <br />
                <small>Doctor: {appointment.doctor_name}</small>
                <br />
                <small>Service: {appointment.service_name}</small>
                <br />
                <small>Date: {new Date(appointment.appointment_date).toLocaleString()}</small>
              </div>
              <div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </section>

      {/* Doctor Edit Modal */}
      <Modal show={showEditDoctorModal} onHide={() => setShowEditDoctorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingDoctor?.name || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specialty</Form.Label>
              <Form.Control
                type="text"
                value={editingDoctor?.specialty || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Years of Experience</Form.Label>
              <Form.Control
                type="number"
                value={editingDoctor?.years_experience || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, years_experience: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditDoctorModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateDoctor}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Appointment Edit Modal */}
      <Modal show={showEditAppointmentModal} onHide={() => setShowEditAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                value={editingAppointment?.patient_name || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, patient_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Doctor ID</Form.Label>
              <Form.Control
                type="text"
                value={editingAppointment?.doctor_id || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, doctor_id: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service ID</Form.Label>
              <Form.Control
                type="text"
                value={editingAppointment?.service_id || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, service_id: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <Form.Control
                type="date"
                value={editingAppointment?.appointment_date || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, appointment_date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAppointmentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateAppointment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Admin;
