export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'secretary';
  speciality?: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  phone: string;
  email?: string;
  address: string;
  emergencyContact: string;
  bloodType?: string;
  allergies: string[];
  medicalHistory: MedicalRecord[];
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  type: 'general' | 'specialist' | 'emergency' | 'followup' | 'preventive' | 'other';
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: Prescription[];
  notes: string;
  attachments: string[];
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: 'cash' | 'card' | 'mobile-money';
  paidAt?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Medicine {
  id: string;
  name: string;
  category: 'medication' | 'medical-supply' | 'equipment' | 'consumable' | 'diagnostic';
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  location: string;
  unit: string; // unité de mesure (boîte, pièce, ml, etc.)
  description?: string;
}

export interface StockMovement {
  id: string;
  medicineId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
  userId: string;
  reference?: string; // référence de la facture ou du bon de commande
}