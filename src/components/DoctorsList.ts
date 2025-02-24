import { createElement, FC } from 'react';
import { Doctor } from '../types/hospital';
import { DoctorCard } from './';

interface DoctorsListProps {
  doctors: Doctor[];
}

const DoctorsList: FC<DoctorsListProps> = ({ doctors }) => {
  return createElement('div', { className: 'row g-4' },
    doctors.map(doctor =>
      createElement('div', {
        key: doctor.id,
        className: 'col-md-6 col-lg-4'
      },
        createElement(DoctorCard, { doctor })
      )
    )
  );
};

export default DoctorsList; 