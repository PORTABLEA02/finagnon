import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Calendar, User, Clock, FileText } from 'lucide-react';
import { MedicalRecord, Patient } from '../../types';

// Mock data
const MOCK_CONSULTATIONS: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: '2024-01-20',
    reason: 'Douleurs thoraciques',
    symptoms: 'Douleur oppressante au niveau du thorax, essoufflement léger',
    diagnosis: 'Suspicion d\'angine de poitrine',
    treatment: 'Repos, surveillance, examens complémentaires',
    prescription: [
      {
        medication: 'Aspirine 75mg',
        dosage: '1 comprimé',
        frequency: '1 fois par jour',
        duration: '30 jours',
        instructions: 'À prendre le matin avec un verre d\'eau'
      }
    ],
    notes: 'Patient anxieux, antécédents familiaux de maladie cardiaque',
    attachments: []
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    date: '2024-01-19',
    reason: 'Contrôle de routine',
    symptoms: 'Aucun symptôme particulier',
    diagnosis: 'État général satisfaisant',
    treatment: 'Poursuite du traitement habituel',
    prescription: [],
    notes: 'Tension artérielle normale, poids stable',
    attachments: []
  }
];

const MOCK_PATIENTS = [
  { id: '1', firstName: 'Jean', lastName: 'Nguema', phone: '+237 690 123 456' },
  { id: '2', firstName: 'Marie', lastName: 'Atangana', phone: '+237 690 987 654' }
];

interface ConsultationListProps {
  onSelectConsultation: (consultation: MedicalRecord) => void;
  onNewConsultation: () => void;
}

export function ConsultationList({ onSelectConsultation, onNewConsultation }: ConsultationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [consultations] = useState<MedicalRecord[]>(MOCK_CONSULTATIONS);

  const filteredConsultations = consultations.filter(consultation => {
    const patient = MOCK_PATIENTS.find(p => p.id === consultation.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           consultation.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
           consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getPatientName = (patientId: string) => {
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
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
        {filteredConsultations.map((consultation) => (
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
                      {getPatientName(consultation.patientId)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(consultation.date).toLocaleDateString('fr-FR')}
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
                  {consultation.prescription.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        {consultation.prescription.length} médicament(s) prescrit(s)
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
        ))}
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