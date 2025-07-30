import React, { useState } from 'react';
import { Calendar, Clock, Plus, User, Phone } from 'lucide-react';
import { Database } from '../../lib/database.types';
import { AppointmentService } from '../../services/appointments';
import { PatientService } from '../../services/patients';
import { ProfileService } from '../../services/profiles';
import { AppointmentForm } from './AppointmentForm';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type Patient = Database['public']['Tables']['patients']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Charger les données au montage du composant
  React.useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, patientsData] = await Promise.all([
        AppointmentService.getByDate(selectedDate),
        PatientService.getAll()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayAppointments = appointments.filter(apt => apt.date === selectedDate);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Patient inconnu';
  };

  const getPatientPhone = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.phone || '';
  };

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setShowAppointmentForm(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleSaveAppointment = (appointmentData: Partial<Appointment>) => {
    const saveAppointment = async () => {
      try {
        if (editingAppointment) {
          await AppointmentService.update(editingAppointment.id, appointmentData);
        } else {
          await AppointmentService.create(appointmentData as any);
        }
        await loadData();
        setShowAppointmentForm(false);
        setEditingAppointment(null);
      } catch (error) {
        console.error('Error saving appointment:', error);
        alert('Erreur lors de la sauvegarde du rendez-vous');
      }
    };
    saveAppointment();
  };

  const handleCloseForm = () => {
    setShowAppointmentForm(false);
    setEditingAppointment(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Planning des Rendez-vous</h2>
            <button 
              onClick={handleNewAppointment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement des rendez-vous...</p>
            </div>
          ) : 
          todayAppointments.length > 0 ? (
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
                            {getPatientName(appointment.patient_id)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {getPatientPhone(appointment.patient_id)}
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
                          <button 
                            onClick={() => handleEditAppointment(appointment)}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium px-2 py-1 rounded"
                          >
                            Modifier
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
          )
          }
        </div>
      </div>

      {showAppointmentForm && (
        <AppointmentForm
          appointment={editingAppointment || undefined}
          onClose={handleCloseForm}
          onSave={handleSaveAppointment}
        />
      )}
    </>
  );
}