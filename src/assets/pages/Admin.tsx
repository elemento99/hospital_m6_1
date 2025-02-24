import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types/hospital';

interface DoctorFormData {
  name: string;
  specialty: string;
  years_experience: string;
}

const Admin: React.FC = () => {
  const { doctors, loading, error, getDoctors, addDoctor } = useHospital();
  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    specialty: '',
    years_experience: ''
  });

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const doctorData: Omit<Doctor, 'id'> = {
        name: formData.name,
        specialty: formData.specialty,
        years_experience: parseInt(formData.years_experience, 10),
        availability: []
      };

      await addDoctor(doctorData);
      setFormData({
        name: '',
        specialty: '',
        years_experience: ''
      });
    } catch (err) {
      console.error('Failed to add doctor:', err);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Add New Doctor</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Specialty</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Control
                    type="number"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                  Add Doctor
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <h3 className="mb-3">Current Doctors</h3>
          {doctors.map((doctor: Doctor) => (
            <Card key={doctor.id} className="mb-3">
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Text>
                  <strong>Specialty:</strong> {doctor.specialty}<br />
                  <strong>Experience:</strong> {doctor.years_experience} years
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
