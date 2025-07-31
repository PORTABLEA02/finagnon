import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type MedicalRecord = Database['public']['Tables']['medical_records']['Row'];
type MedicalRecordInsert = Database['public']['Tables']['medical_records']['Insert'];
type MedicalRecordUpdate = Database['public']['Tables']['medical_records']['Update'];
type Prescription = Database['public']['Tables']['prescriptions']['Row'];
type PrescriptionInsert = Database['public']['Tables']['prescriptions']['Insert'];

export class MedicalRecordService {
  // Récupérer tous les dossiers médicaux
  static async getAll(): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        patient:patients(first_name, last_name, phone),
        doctor:profiles!doctor_id(first_name, last_name, speciality),
        prescriptions(*)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les dossiers médicaux d'un patient
  static async getByPatient(patientId: string): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        doctor:profiles!doctor_id(first_name, last_name, speciality),
        prescriptions(*)
      `)
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching patient medical records:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les dossiers médicaux d'un médecin
  static async getByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        patient:patients(first_name, last_name, phone),
        prescriptions(*)
      `)
      .eq('doctor_id', doctorId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching doctor medical records:', error);
      throw error;
    }

    return data || [];
  }

  // Créer un nouveau dossier médical avec prescriptions
  static async create(
    recordData: MedicalRecordInsert,
    prescriptions: Omit<PrescriptionInsert, 'medical_record_id'>[] = []
  ): Promise<MedicalRecord> {
    const { data: record, error: recordError } = await supabase
      .from('medical_records')
      .insert(recordData)
      .select()
      .single();

    if (recordError) {
      console.error('Error creating medical record:', recordError);
      throw recordError;
    }

    // Ajouter les prescriptions si elles existent
    if (prescriptions.length > 0) {
      const { error: prescriptionError } = await supabase
        .from('prescriptions')
        .insert(
          prescriptions.map(prescription => ({
            ...prescription,
            medical_record_id: record.id
          }))
        );

      if (prescriptionError) {
        console.error('Error creating prescriptions:', prescriptionError);
        // Ne pas faire échouer la création du dossier médical
      }
    }

    return record;
  }

  // Mettre à jour un dossier médical
  static async update(id: string, updates: MedicalRecordUpdate): Promise<MedicalRecord> {
    const { data, error } = await supabase
      .from('medical_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }

    return data;
  }

  // Supprimer un dossier médical
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  }

  // Ajouter une prescription à un dossier médical
  static async addPrescription(medicalRecordId: string, prescription: Omit<PrescriptionInsert, 'medical_record_id'>): Promise<Prescription> {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        ...prescription,
        medical_record_id: medicalRecordId
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding prescription:', error);
      throw error;
    }

    return data;
  }

  // Supprimer une prescription
  static async deletePrescription(prescriptionId: string): Promise<void> {
    const { error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', prescriptionId);

    if (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  }

  // Rechercher dans les dossiers médicaux
  static async search(query: string): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        patient:patients(first_name, last_name, phone),
        doctor:profiles!doctor_id(first_name, last_name, speciality),
        prescriptions(*)
      `)
      .or(`reason.ilike.%${query}%,diagnosis.ilike.%${query}%,symptoms.ilike.%${query}%`)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error searching medical records:', error);
      throw error;
    }

    return data || [];
  }
}