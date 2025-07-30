import React, { useState } from 'react';
import { Calendar, Clock, Plus, User, Phone } from 'lucide-react';
import { Appointment } from '../../types';

// Mock data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: '2024-01-20',
    time: '09:00',
    duration: 30,
    reason: 'Consultation de routine',
    status: 'confirmed',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    date: '2024-01-20',
    time: '10:30',
    duration: 45,
    reason: 'Contrôle cardiologique',
    status: 'scheduled',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

const MOCK_PATIENTS = [
  { id: '1', firstName: 'Jean', lastName: 'Nguema', phone: '+237 690 123 456' },
  { id: '2', firstName: 'Marie', lastName: 'Atangana', phone: '+237 690 987 654' }
];

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-orange-100 text-orange-800'
};

const STATUS_LABELS = {
  scheduled: 'Planifié',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  cancelled: 'Annulé',
  'no-show': 'Absent'
};

export function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  const todayAppointments = appointments.filter(apt => apt.date === selectedDate);

  const getPatientName = (patientId: string) => {
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getPatientPhone = (patientId: string) => {
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    return patient?.phone || '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Planning des Rendez-vous</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouveau RDV</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              {todayAppointments.length} rendez-vous programmés
            </div>
          </div>
        </div>

        <div className="p-6">
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {appointment.time}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({appointment.duration} min)
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {getPatientName(appointment.patientId)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {getPatientPhone(appointment.patientId)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[appointment.status]}`}>
                          {STATUS_LABELS[appointment.status]}
                        </span>
                        <div className="flex space-x-1">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded">
                            Voir
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium px-2 py-1 rounded">
                            Confirmer
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded">
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Motif :</strong> {appointment.reason}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rendez-vous programmé pour cette date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}