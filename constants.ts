
import { Tender, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Alex Chen',
    email: 'alex@tenderpulse.com',
    role: 'admin',
    avatar: 'https://picsum.photos/seed/alex/100/100'
  },
  {
    id: 'USR-002',
    name: 'Marta García',
    email: 'marta@tenderpulse.com',
    role: 'editor',
    avatar: 'https://picsum.photos/seed/marta/100/100'
  },
  {
    id: 'USR-003',
    name: 'Lucas Pérez',
    email: 'lucas@tenderpulse.com',
    role: 'viewer',
    avatar: 'https://picsum.photos/seed/lucas/100/100'
  }
];

export const MOCK_TENDERS: Tender[] = [
  {
    id: '4933-131122',
    title: 'Infraestructura de Ciudad Inteligente - Fase 2',
    issuer: 'Autoridad de Desarrollo Metropolitano',
    description: 'Adquisición de sensores IoT integrados para la gestión del tráfico y monitoreo ambiental en el corredor del centro.',
    value: '2.400.000 €',
    date: '2024-05-15',
    status: 'new'
  },
  {
    id: '5021-99281',
    title: 'Actualización de HVAC del Hospital Regional',
    issuer: 'Ejecutivo de Servicios de Salud',
    description: 'Revisión completa de los sistemas de calefacción, ventilación y aire acondicionado para el ala quirúrgica, incluyendo contrato de mantenimiento por 5 años.',
    value: '850.000 €',
    date: '2024-04-20',
    status: 'new'
  }
];
