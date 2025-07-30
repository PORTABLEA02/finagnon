import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Phone, Mail } from 'lucide-react';
import { Patient } from '../../types';

// Mock data
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Nguema',
    dateOfBirth: '1985-03-15',
    gender: 'M',
    phone: '+237 690 123 456',
    email: 'jean.nguema@email.com',
    address: 'Yaoundé, Quartier Bastos',
    emergencyContact: '+237 690 654 321',
    bloodType: 'A+',
    allergies: ['Pénicilline'],
    medicalHistory: [],
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Atangana',
    dateOfBirth: '1992-07-22',
    gender: 'F',
    phone: '+237 690 987 654',
    email: 'marie.atangana@email.com',
    address: 'Douala, Akwa',
    emergencyContact: '+237 690 111 222',
    bloodType: 'O-',
    allergies: [],
    medicalHistory: [],
    createdAt: '2024-01-10T00:00:00Z'
  }
];

interface PatientListProps {
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export function PatientList({ onSelectPatient, onAddPatient }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Gestion des Patients</h2>
          <button
            onClick={onAddPatient}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Patient</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Âge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Groupe Sanguin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.gender === 'M' ? 'Masculin' : 'Féminin'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{patient.phone}</span>
                    </div>
                    {patient.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{patient.email}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {calculateAge(patient.dateOfBirth)} ans
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {patient.bloodType || 'Non défini'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="Voir le dossier"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-800 p-1 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun patient trouvé</p>
        </div>
      )}
    </div>
  );
}