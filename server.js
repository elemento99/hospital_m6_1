import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Importa helmet
import { login, register } from './backend/controllers/usersController.js';
import {
  getAllDoctorsController, getAllServicesController, getAllDoctorServicesController, createAppointmentController,
  getAppointmentsController,
  getAppointmentController,
  deleteAppointmentController,
  updateAppointmentController,
  getDoctorController,
  createDoctorController,
  updateDoctorController,
  deleteDoctorController,
} from './backend/controllers/hospitalController.js';

dotenv.config();

const app = express();
const port = 5000;

// Configura helmet
app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rutas
app.post('/login', login);
app.post('/register', register);
app.post('/appointment', createAppointmentController);
app.get('/services', getAllServicesController);
app.get('/doctors', getAllDoctorsController);
app.get('/doctor-services', getAllDoctorServicesController);
app.get('/appointments', getAppointmentsController);
app.get('/appointments/:id', getAppointmentController);
app.post('/appointments/', createAppointmentController);
app.put('/appointments/:id', updateAppointmentController);
app.delete('/appointments/:id', deleteAppointmentController);

app.get('/doctors/:id', getDoctorController);
app.post('/doctors', createDoctorController);
app.put('/doctors/:id', updateDoctorController);
app.delete('/doctors/:id', deleteDoctorController);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
