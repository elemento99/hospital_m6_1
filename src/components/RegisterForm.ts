import { createElement, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { setAuth, validateEmail, validatePassword } from '../utils';
import { ErrorAlert } from './';

const RegisterForm: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      const response = await apiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setAuth(response.token, response.user.role);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return createElement('div', { className: 'container mt-5' },
    createElement('div', { className: 'row justify-content-center' },
      createElement('div', { className: 'col-md-6' },
        error && createElement(ErrorAlert, { message: error }),
        createElement('form', { onSubmit: handleSubmit },
          createElement('div', { className: 'mb-3' },
            createElement('label', { 
              htmlFor: 'name',
              className: 'form-label'
            }, 'Name'),
            createElement('input', {
              type: 'text',
              className: 'form-control',
              id: 'name',
              name: 'name',
              value: formData.name,
              onChange: handleChange,
              required: true
            })
          ),
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'email',
              className: 'form-label'
            }, 'Email'),
            createElement('input', {
              type: 'email',
              className: 'form-control',
              id: 'email',
              name: 'email',
              value: formData.email,
              onChange: handleChange,
              required: true
            })
          ),
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'password',
              className: 'form-label'
            }, 'Password'),
            createElement('input', {
              type: 'password',
              className: 'form-control',
              id: 'password',
              name: 'password',
              value: formData.password,
              onChange: handleChange,
              required: true
            })
          ),
          createElement('div', { className: 'mb-3' },
            createElement('label', {
              htmlFor: 'confirmPassword',
              className: 'form-label'
            }, 'Confirm Password'),
            createElement('input', {
              type: 'password',
              className: 'form-control',
              id: 'confirmPassword',
              name: 'confirmPassword',
              value: formData.confirmPassword,
              onChange: handleChange,
              required: true
            })
          ),
          createElement('button', {
            type: 'submit',
            className: 'btn btn-primary w-100',
            disabled: loading
          }, loading ? 'Registering...' : 'Register')
        )
      )
    )
  );
};

export default RegisterForm; 