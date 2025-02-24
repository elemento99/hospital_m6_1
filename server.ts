import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Types
interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
}

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware to verify JWT token
const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req: AuthRequest, res: express.Response, next: express.NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};

// Routes
const getDoctors = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM doctors');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

const getServices = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Error fetching services' });
  }
};

const createAppointment = async (req: AuthRequest, res: express.Response): Promise<void> => {
  const { doctor_id, service_id, patient_name, appointment_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (doctor_id, service_id, patient_name, appointment_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [doctor_id, service_id, patient_name, appointment_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

const register = async (req: express.Request, res: express.Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
      [name, email, hashedPassword, 'user']
    );
    
    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    res.json({
      token,
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req: express.Request, res: express.Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0] as User;

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Admin routes
const getAllAppointments = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        d.name as doctor_name,
        d.specialty as doctor_specialty,
        s.name as service_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all appointments:', err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

const updateDoctor = async (req: express.Request, res: express.Response): Promise<void> => {
  const { id } = req.params;
  const { name, specialty, years_experience } = req.body;
  try {
    // First check if doctor exists
    const checkResult = await pool.query('SELECT id FROM doctors WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    const result = await pool.query(
      'UPDATE doctors SET name = $1, specialty = $2, years_experience = $3 WHERE id = $4 RETURNING *',
      [name, specialty, years_experience, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

const deleteDoctor = async (req: express.Request, res: express.Response): Promise<void> => {
  const { id } = req.params;
  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Delete doctor_services relationships (cascade will handle this automatically)
    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    // Commit transaction
    await pool.query('COMMIT');
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error deleting doctor:', err);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
};

const addDoctor = async (req: express.Request, res: express.Response): Promise<void> => {
  const { name, specialty, years_experience, service_id } = req.body;
  try {
    // Validate required fields
    if (!name || !specialty || years_experience === undefined || !service_id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Start a transaction
    await pool.query('BEGIN');

    // Insert doctor
    const doctorResult = await pool.query(
      'INSERT INTO doctors (name, specialty, years_experience) VALUES ($1, $2, $3) RETURNING *',
      [name, specialty, years_experience]
    );

    // Insert doctor_service relationship
    await pool.query(
      'INSERT INTO doctor_services (doctor_id, service_id) VALUES ($1, $2)',
      [doctorResult.rows[0].id, service_id]
    );

    // Commit transaction
    await pool.query('COMMIT');

    res.status(201).json(doctorResult.rows[0]);
  } catch (err) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error adding doctor:', err);
    res.status(500).json({ message: 'Error adding doctor' });
  }
};

// Health check endpoint
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

// Route handlers
app.get('/doctors', getDoctors);
app.get('/services', getServices);
app.post('/appointments', authenticateToken, createAppointment);
app.post('/auth/register', register);
app.post('/auth/login', login);

// Admin routes
app.get('/admin/appointments', authenticateToken, isAdmin, getAllAppointments);
app.get('/appointments', authenticateToken, getAllAppointments);
app.post('/admin/doctors', authenticateToken, isAdmin, addDoctor);
app.put('/admin/doctors/:id', authenticateToken, isAdmin, updateDoctor);
app.delete('/admin/doctors/:id', authenticateToken, isAdmin, deleteDoctor);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 