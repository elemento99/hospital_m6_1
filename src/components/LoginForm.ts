import { createElement, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { setAuth } from '../utils';
import { ErrorAlert } from './';

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login({ email, password });
      setAuth(response.token, response.user.role);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
              htmlFor: 'email',
              className: 'form-label'
            }, 'Email'),
            createElement('input', {
              type: 'email',
              className: 'form-control',
              id: 'email',
              value: email,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
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
              value: password,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
              required: true
            })
          ),
          createElement('button', {
            type: 'submit',
            className: 'btn btn-primary w-100',
            disabled: loading
          }, loading ? 'Logging in...' : 'Login')
        )
      )
    )
  );
};

export default LoginForm; 