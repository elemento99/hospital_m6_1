import { createElement, FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import { ErrorAlert, LoadingSpinner } from './';

const AppointmentForm: FC = () => {
  const navigate = useNavigate();
  const { addAppointment, getDoctors, doctors, loading, error } = useHospital();
  const [formData, setFormData] = useState({
    doctor_id: 0,
    service_id: 0,
    patient_name: '',
    appointment_date: '',
    time: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;

    if (name === 'doctorName') {
      const selectedDoctor = doctors.find(d => d.name === value);
      newValue = selectedDoctor ? selectedDoctor.id : 0;
    }

    setFormData(prev => ({
      ...prev,
      [name === 'doctorName' ? 'doctor_id' : name]: typeof newValue === 'string' ? newValue : Number(newValue),
    }));
  };

  const validateForm = () => {
    if (!formData.doctor_id) {
      setFormError('Please select a doctor');
      return false;
    }
    if (!formData.patient_name.trim()) {
      setFormError('Patient name is required');
      return false;
    }
    if (!formData.appointment_date) {
      setFormError('Please select a date');
      return false;
    }
    if (!formData.time) {
      setFormError('Please select a time');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormError('');
    setSubmitting(true);

    try {
      await addAppointment({
        ...formData,
        status: 'pending',
      });
      navigate('/appointments');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return createElement(LoadingSpinner);
  }

  const selectedDoctor = doctors.find(d => d.id === formData.doctor_id);

  return createElement('div', { className: 'container mt-5' },
    createElement('div', { className: 'row justify-content-center' },
      createElement('div', { className: 'col-md-6' },
        (error || formError) && createElement(ErrorAlert, { message: error || formError }),
        createElement('form', { onSubmit: handleSubmit },
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'doctorName',
              className: 'form-label'
            }, 'Select Doctor'),
            createElement('select', {
              className: 'form-select',
              id: 'doctorName',
              name: 'doctorName',
              value: formData.doctor_id,
              onChange: handleChange,
              required: true
            },
              createElement('option', { value: '' }, 'Choose a doctor'),
              doctors.map(doctor =>
                createElement('option', {
                  key: doctor.id,
                  value: doctor.name
                }, doctor.name)
              )
            )
          ),
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'patientName',
              className: 'form-label'
            }, 'Patient Name'),
            createElement('input', {
              type: 'text',
              className: 'form-control',
              id: 'patientName',
              name: 'patient_name',
              value: formData.patient_name,
              onChange: handleChange,
              required: true
            })
          ),
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'date',
              className: 'form-label'
            }, 'Date'),
            createElement('input', {
              type: 'date',
              className: 'form-control',
              id: 'date',
              name: 'appointment_date',
              value: formData.appointment_date,
              onChange: handleChange,
              min: new Date().toISOString().split('T')[0],
              required: true
            })
          ),
          selectedDoctor && createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'time',
              className: 'form-label'
            }, 'Time'),
            createElement('select', {
              className: 'form-select',
              id: 'time',
              name: 'time',
              value: formData.time,
              onChange: handleChange,
              required: true
            },
              createElement('option', { value: '' }, 'Choose a time'),
              selectedDoctor.availability?.map((time: string) =>
                createElement('option', {
                  key: time,
                  value: time
                }, time)
              )
            )
          ),
          createElement('button', {
            type: 'submit',
            className: 'btn btn-primary w-100',
            disabled: submitting
          }, submitting ? 'Creating Appointment...' : 'Create Appointment')
        )
      )
    )
  );
};

export default AppointmentForm;
