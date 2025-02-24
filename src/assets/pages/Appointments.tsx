import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useHospital } from '../../context/HospitalContext';

interface AppointmentFormData {
  doctor_id: string;
  service_id: string;
  patient_name: string;
  date: string;
  time: string;
}

const Appointments: React.FC = () => {
  const { appointments, doctors, services, loading, error, addAppointment, getAppointments, getDoctors, getServices } = useHospital();
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctor_id: '',
    service_id: '',
    patient_name: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAppointments(), getDoctors(), getServices()]);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const appointmentData = {
        doctor_id: parseInt(formData.doctor_id),
        service_id: parseInt(formData.service_id),
        patient_name: formData.patient_name,
        appointment_date: `${formData.date} ${formData.time}`,
        status: 'pending',
        time: formData.time
      };

      await addAppointment(appointmentData);
      setFormData({
        doctor_id: '',
        service_id: '',
        patient_name: '',
        date: '',
        time: ''
      });
    } catch (err) {
      console.error('Failed to create appointment:', err);
    }
  };

  const getDoctor = (id: number) => doctors.find(d => d.id === id);
  const getService = (id: number) => services.find(s => s.id === id);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Appointments</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Book New Appointment</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Service</Form.Label>
                  <Form.Select
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                  Book Appointment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <h3 className="mb-3">Your Appointments</h3>
          {appointments.map((appointment) => {
            const doctor = getDoctor(appointment.doctor_id);
            const service = getService(appointment.service_id);
            const [date, time] = appointment.appointment_date.split(' ');

            return (
              <Card key={appointment.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{doctor?.name}</Card.Title>
                  <Card.Text>
                    <strong>Patient:</strong> {appointment.patient_name}<br />
                    <strong>Service:</strong> {service?.name}<br />
                    <strong>Date:</strong> {date}<br />
                    <strong>Time:</strong> {time}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default Appointments;
