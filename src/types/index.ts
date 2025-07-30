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
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  phone: string;
  email?: string;
  address: string;
  emergency_contact: string;
  blood_type?: string;
  allergies: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  date: string;
  type: 'general' | 'specialist' | 'emergency' | 'followup' | 'preventive' | 'other';
  reason: string;
  symptoms?: string;
  diagnosis: string;
  treatment?: string;
  notes?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  medical_record_id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Invoice {
  id: string;
  patient_id: string;
  appointment_id?: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  payment_method?: 'cash' | 'card' | 'mobile-money' | 'bank-transfer' | 'check';
  paid_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  medicine_id?: string;
  created_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: 'medication' | 'medical-supply' | 'equipment' | 'consumable' | 'diagnostic';
  manufacturer: string;
  batch_number: string;
  expiry_date: string;
  current_stock: number;
  min_stock: number;
  unit_price: number;
  location: string;
  unit: string; // unité de mesure (boîte, pièce, ml, etc.)
  description?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface StockMovement {
  id: string;
  medicine_id: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
  user_id: string;
  reference?: string; // référence de la facture ou du bon de commande
  created_at: string;
}