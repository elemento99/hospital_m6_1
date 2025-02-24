import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useHospital } from '../../context/HospitalContext';

const Team: React.FC = () => {
  const { doctors, loading, error, getDoctors } = useHospital();

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Our Medical Team</h2>
      <Row>
        {doctors.map((doctor) => (
          <Col key={doctor.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {doctor.specialty}
                </Card.Subtitle>
                <Card.Text>
                  Experience: {doctor.years_experience} years
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Team; 