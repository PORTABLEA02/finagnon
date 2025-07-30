import React, { useState } from 'react';
import { X, Save, Calendar, Clock, User, FileText } from 'lucide-react';
import { Appointment, Patient } from '../../types';

// Mock patients data
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

// Mock doctors data
const MOCK_DOCTORS = [
  { id: '2', firstName: 'Dr. Paul', lastName: 'Martin', speciality: 'Cardiologie' },
  { id: '3', firstName: 'Dr. Sophie', lastName: 'Dubois', speciality: 'Pédiatrie' },
  { id: '4', firstName: 'Dr. Jean', lastName: 'Kouam', speciality: 'Médecine générale' }
];

// Time slots for appointments
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

interface AppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>) => void;
}

export function AppointmentForm({ appointment, onClose, onSave }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '',
    duration: appointment?.duration || 30,
    reason: appointment?.reason || '',
    status: appointment?.status || 'scheduled',
    notes: appointment?.notes || ''
  });

  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const addNewPatient = () => {
    if (newPatient.firstName && newPatient.lastName && newPatient.phone) {
      // In a real app, this would make an API call to create the patient
      console.log('Creating new patient:', newPatient);
      setShowNewPatientForm(false);
      setNewPatient({ firstName: '', lastName: '', phone: '', email: '' });
    }
  };

  const getPatientInfo = (patientId: string) => {
    return MOCK_PATIENTS.find(p => p.id === patientId);
  };

  const getDoctorInfo = (doctorId: string) => {
    return MOCK_DOCTORS.find(d => d.id === doctorId);
  };

  const selectedPatient = getPatientInfo(formData.patientId);
  const selectedDoctor = getDoctorInfo(formData.doctorId);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {appointment ? 'Modifier le Rendez-vous' : 'Nouveau Rendez-vous'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Selection */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">Sélection du Patient</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPatientForm(!showNewPatientForm)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showNewPatientForm ? 'Annuler' : '+ Nouveau patient'}
              </button>
            </div>

            {showNewPatientForm ? (
              <div className="bg-white rounded-lg p-4 border border-blue-200 space-y-3">
                <h4 className="font-medium text-gray-800">Ajouter un nouveau patient</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom *"
                    value={newPatient.firstName}
                    onChange={handleNewPatientChange}
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom *"
                    value={newPatient.lastName}
                    onChange={handleNewPatientChange}
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone *"
                    value={newPatient.phone}
                    onChange={handleNewPatientChange}
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newPatient.email}
                    onChange={handleNewPatientChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={addNewPatient}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter le patient
                </button>
              </div>
            ) : (
              <div>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un patient</option>
                  {MOCK_PATIENTS.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.phone}
                    </option>
                  ))}
                </select>

                {selectedPatient && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Âge: </span>
                        <span className="text-gray-900">
                          {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} ans
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Téléphone: </span>
                        <span className="text-gray-900">{selectedPatient.phone}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email: </span>
                        <span className="text-gray-900">{selectedPatient.email || 'Non renseigné'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Groupe sanguin: </span>
                        <span className="text-gray-900">{selectedPatient.bloodType || 'Non défini'}</span>
                      </div>
                    </div>
                    {selectedPatient.allergies.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium text-red-700">Allergies: </span>
                        <span className="text-red-600">{selectedPatient.allergies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Médecin *
            </label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un médecin</option>
              {MOCK_DOCTORS.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName} - {doctor.speciality}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Heure *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une heure</option>
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (minutes) *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 heure</option>
                <option value={90}>1h30</option>
                <option value={120}>2 heures</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="scheduled">Planifié</option>
                <option value="confirmed">Confirmé</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
                <option value="no-show">Absent</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Motif de consultation *
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder="Ex: Consultation de routine, Contrôle cardiologique..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes complémentaires
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Notes particulières, instructions spéciales..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Summary */}
          {formData.patientId && formData.doctorId && formData.date && formData.time && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Résumé du rendez-vous</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Patient:</strong> {selectedPatient?.firstName} {selectedPatient?.lastName}</p>
                <p><strong>Médecin:</strong> {selectedDoctor?.firstName} {selectedDoctor?.lastName}</p>
                <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('fr-FR')}</p>
                <p><strong>Heure:</strong> {formData.time} ({formData.duration} min)</p>
                <p><strong>Motif:</strong> {formData.reason}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}