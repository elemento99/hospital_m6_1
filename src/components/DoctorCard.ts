import { Doctor } from '../types/hospital';
import { createElement, FC } from 'react';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: FC<DoctorCardProps> = ({ doctor }) => {
  return createElement('div', { className: 'card h-100' },
    createElement('div', { className: 'card-body' },
      createElement('h5', { className: 'card-title' }, doctor.name),
      createElement('p', { className: 'card-text' }, doctor.specialty),
      createElement('p', { className: 'card-text' }, 
        createElement('small', { className: 'text-muted' }, 
          'Available: ' + doctor.availability.join(', ')
        )
      )
    )
  );
};

export default DoctorCard; 