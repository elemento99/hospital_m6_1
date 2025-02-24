import { createElement, FC } from 'react';
import { ServiceResponse } from '../types/api';

interface ServiceListProps {
  services: ServiceResponse[];
}

const ServiceList: FC<ServiceListProps> = ({ services }) => {
  return createElement('div', { className: 'row g-4' },
    services.map(service => 
      createElement('div', { 
        key: service.id,
        className: 'col-md-6 col-lg-4'
      },
        createElement('div', { className: 'card h-100' },
          createElement('div', { className: 'card-body' },
            createElement('h5', { className: 'card-title' }, service.name),
            createElement('p', { className: 'card-text' }, service.description)
          )
        )
      )
    )
  );
};

export default ServiceList; 