import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Calendar, User, Clock, FileText, Tag } from 'lucide-react';
import { Database } from '../../lib/database.types';
import { supabase } from '../../lib/supabase';
import { PatientService } from '../../services/patients';

type MedicalRecord = Database['public']['Tables']['medical_records']['Row'];
type Patient = Database['public']['Tables']['patients']['Row'];

interface ConsultationListProps {
  onSelectConsultation: (consultation: MedicalRecord) => void;
  onNewConsultation: () => void;
}

export function ConsultationList({ onSelectConsultation, onNewConsultation }: ConsultationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [consultations, setConsultations] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage du composant
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [consultationsData, patientsData] = await Promise.all([
        getMedicalRecords(),
        PatientService.getAll()
      ]);
      setConsultations(consultationsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedicalRecords = async () => {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        prescriptions(*)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }

    return data || [];
  };

  const filteredConsultations = consultations.filter(consultation => {
    const patient = patients.find(p => p.id === consultation.patient_id);
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           consultation.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
           consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Patient inconnu';
  };

  const getConsultationTypeLabel = (type: string) => {
    const types = {
      general: 'Générale',
      specialist: 'Spécialisée',
      emergency: 'Urgence',
      followup: 'Suivi',
      preventive: 'Préventive',
      other: 'Autre'
    };
    return types[type as keyof typeof types] || 'Non défini';
  };

  const getConsultationTypeColor = (type: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      specialist: 'bg-purple-100 text-purple-800',
      emergency: 'bg-red-100 text-red-800',
      followup: 'bg-green-100 text-green-800',
      preventive: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Consultations Médicales</h2>
          <button
            onClick={onNewConsultation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Consultation</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par patient, motif ou diagnostic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement des consultations...</p>
          </div>
        ) : (
        filteredConsultations.map((consultation) => (
          <div
            key={consultation.id}
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onSelectConsultation(consultation)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {getPatientName(consultation.patient_id)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(consultation.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConsultationTypeColor(consultation.type)}`}>
                      {getConsultationTypeLabel(consultation.type)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Motif: </span>
                    <span className="text-sm text-gray-900">{consultation.reason}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Diagnostic: </span>
                    <span className="text-sm text-gray-900">{consultation.diagnosis}</span>
                  </div>
                  {consultation.prescriptions && consultation.prescriptions.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        {consultation.prescriptions.length} médicament(s) prescrit(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectConsultation(consultation);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Voir la consultation"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement edit functionality
                  }}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Modifier"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      {filteredConsultations.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune consultation trouvée</p>
        </div>
      )}
    </div>
  );
}

export { ConsultationList }