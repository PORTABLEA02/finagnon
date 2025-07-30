import React, { useState } from 'react';
import { Search, Printer, Eye, Calendar, User, Pill, FileText, Filter } from 'lucide-react';
import { Database } from '../../lib/database.types';
import { supabase } from '../../lib/supabase';
import { PatientService } from '../../services/patients';
import { ProfileService } from '../../services/profiles';
import { PrescriptionDetail } from './PrescriptionDetail';

type MedicalRecord = Database['public']['Tables']['medical_records']['Row'];
type Patient = Database['public']['Tables']['patients']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function PrescriptionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage du composant
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [consultationsData, patientsData, doctorsData] = await Promise.all([
        getMedicalRecordsWithPrescriptions(),
        PatientService.getAll(),
        ProfileService.getDoctors()
      ]);
      setConsultations(consultationsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedicalRecordsWithPrescriptions = async () => {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        prescriptions(*)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching medical records with prescriptions:', error);
      throw error;
    }

    // Filtrer seulement les consultations avec prescriptions
    return (data || []).filter(record => record.prescriptions && record.prescriptions.length > 0);
  };

  const filteredConsultations = consultations.filter(consultation => {
    const patient = patients.find(p => p.id === consultation.patient_id);
    const doctor = doctors.find(d => d.id === consultation.doctor_id);
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';
    const doctorName = doctor ? `${doctor.first_name} ${doctor.last_name}` : '';

    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.prescriptions.some((p: any) => 
                           p.medication.toLowerCase().includes(searchTerm.toLowerCase())
                         );

    const matchesDoctor = selectedDoctor === 'all' || consultation.doctor_id === selectedDoctor;

    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const consultationDate = new Date(consultation.date);
      const today = new Date();
      const daysDiff = Math.ceil((today.getTime() - consultationDate.getTime()) / (1000 * 3600 * 24));
      
      switch (selectedPeriod) {
        case 'today':
          matchesPeriod = daysDiff === 0;
          break;
        case 'week':
          matchesPeriod = daysDiff <= 7;
          break;
        case 'month':
          matchesPeriod = daysDiff <= 30;
          break;
      }
    }

    return matchesSearch && matchesDoctor && matchesPeriod;
  });

  const getPatientInfo = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  const getDoctorInfo = (doctorId: string) => {
    return doctors.find(d => d.id === doctorId);
  };

  const handlePrintPrescription = (consultation: MedicalRecord) => {
    // Créer le contenu d'impression
    const printContent = generatePrintContent(consultation);
    
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Veuillez autoriser les pop-ups pour imprimer l\'ordonnance');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Attendre que le contenu soit chargé avant d'imprimer
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Fermer la fenêtre après impression (optionnel)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  const generatePrintContent = (consultation: MedicalRecord) => {
    const patient = getPatientInfo(consultation.patient_id);
    const doctor = getDoctorInfo(consultation.doctor_id);
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const currentTime = new Date().toLocaleTimeString('fr-FR');

    // Calculer l'âge du patient
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

    const patientAge = patient ? calculateAge(patient.date_of_birth) : 'N/A';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ordonnance - ${patient?.firstName} ${patient?.lastName}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.4;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 15px;
              background: white;
              font-size: 12px;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            
            .clinic-name {
              font-size: 22px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
            
            .clinic-subtitle {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            
            .clinic-info {
              font-size: 12px;
              color: #666;
              line-height: 1.4;
            }
            
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              gap: 20px;
            }
            
            .patient-info, .doctor-info {
              flex: 1;
              background: #f8f9fa;
              padding: 12px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            
            .info-title {
              font-size: 14px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .info-item {
              margin-bottom: 4px;
              font-size: 12px;
            }
            
            .info-label {
              font-weight: bold;
              color: #555;
            }
            
            .prescription-section {
              margin-bottom: 20px;
            }
            
            .prescription-title {
              font-size: 16px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 15px;
              text-align: center;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 8px;
            }
            
            .prescription-item {
              border: 2px solid #e5e7eb;
              padding: 15px;
              margin-bottom: 12px;
              border-radius: 8px;
              background: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .medication-header {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
            }
            
            .medication-number {
              background: #2563eb;
              color: white;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              margin-right: 12px;
              font-size: 12px;
            }
            
            .medication-name {
              font-size: 16px;
              font-weight: bold;
              color: #333;
            }
            
            .prescription-details {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 12px;
              margin-bottom: 12px;
            }
            
            .detail-item {
              background: #f8f9fa;
              padding: 8px;
              border-radius: 5px;
              border-left: 3px solid #2563eb;
            }
            
            .detail-label {
              font-size: 10px;
              font-weight: bold;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .detail-value {
              font-size: 12px;
              font-weight: bold;
              color: #333;
            }
            
            .instructions {
              background: #e8f4fd;
              border: 1px solid #bee5eb;
              border-radius: 5px;
              padding: 10px;
              margin-top: 8px;
            }
            
            .instructions-label {
              font-weight: bold;
              color: #0c5460;
              margin-bottom: 4px;
              font-size: 11px;
            }
            
            .instructions-text {
              color: #0c5460;
              font-style: italic;
              font-size: 11px;
            }
            
            .notes-section {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 20px;
            }
            
            .notes-title {
              font-weight: bold;
              color: #856404;
              margin-bottom: 8px;
              font-size: 12px;
            }
            
            .notes-text {
              color: #856404;
              font-style: italic;
              font-size: 11px;
            }
            
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              margin-bottom: 20px;
            }
            
            .signature-box {
              text-align: center;
              width: 180px;
            }
            
            .signature-line {
              border-top: 2px solid #333;
              margin-bottom: 8px;
              margin-top: 50px;
            }
            
            .signature-label {
              font-size: 12px;
              font-weight: bold;
              color: #666;
            }
            
            .signature-name {
              font-size: 14px;
              font-weight: bold;
              color: #333;
              margin-top: 4px;
            }
            
            .footer {
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              margin-top: 20px;
            }
            
            .footer-item {
              margin-bottom: 2px;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 10px;
              }
              
              .prescription-item {
                break-inside: avoid;
              }
              
              .signature-section {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">CliniCare</div>
            <div class="clinic-subtitle">Système de Gestion Médicale</div>
            <div class="clinic-info">Yaoundé, Cameroun | Tél: +237 690 000 000</div>
          </div>

          <div class="info-section">
            <div class="patient-info">
              <div class="info-title">Informations Patient</div>
              <div class="info-item">
                <span class="info-label">Nom complet:</span> ${patient?.first_name} ${patient?.last_name}
              </div>
              <div class="info-item">
                <span class="info-label">Âge:</span> ${patientAge} ans
              </div>
              <div class="info-item">
                <span class="info-label">Date de consultation:</span> ${new Date(consultation.date).toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div class="doctor-info">
              <div class="info-title">Médecin Prescripteur</div>
              <div class="info-item">
                <span class="info-label">Nom:</span> ${doctor?.first_name} ${doctor?.last_name}
              </div>
              <div class="info-item">
                <span class="info-label">Spécialité:</span> ${doctor?.speciality}
              </div>
              <div class="info-item">
                <span class="info-label">Date:</span> ${new Date(consultation.date).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>

          <div class="prescription-section">
            <div class="prescription-title">Ordonnance Médicale</div>
            
            ${consultation.prescriptions.map((prescription: any, index: number) => `
              <div class="prescription-item">
                <div class="medication-header">
                  <div class="medication-number">${index + 1}</div>
                  <div class="medication-name">${prescription.medication}</div>
                </div>
                
                <div class="prescription-details">
                  <div class="detail-item">
                    <div class="detail-label">Dosage</div>
                    <div class="detail-value">${prescription.dosage}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Fréquence</div>
                    <div class="detail-value">${prescription.frequency}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Durée du traitement</div>
                    <div class="detail-value">${prescription.duration}</div>
                  </div>
                </div>
                
                ${prescription.instructions ? `
                  <div class="instructions">
                    <div class="instructions-label">Instructions particulières:</div>
                    <div class="instructions-text">${prescription.instructions}</div>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div class="signature-label">Signature du patient</div>
              <div class="signature-name">${patient?.first_name} ${patient?.last_name}</div>
            </div>
            
            <div class="signature-box">
              <div class="signature-line"></div>
              <div class="signature-label">Signature du médecin</div>
              <div class="signature-name">${doctor?.first_name} ${doctor?.last_name}</div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-item">Ordonnance émise le ${currentDate} à ${currentTime}</div>
            <div class="footer-item">ID Consultation: ${consultation.id}</div>
            <div class="footer-item">Cette ordonnance est valable 3 mois à compter de la date d'émission</div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Gestion des Ordonnances</h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualiser et imprimer les ordonnances émises par les médecins
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Pill className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  {consultations.length} ordonnances
                </div>
                <div className="text-xs text-gray-500">
                  {consultations.reduce((total, c) => total + (c.prescriptions?.length || 0), 0)} médicaments
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par patient, médecin ou médicament..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>

              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tous les médecins</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.first_name} {doctor.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement des ordonnances...</p>
            </div>
          ) : (
          {filteredConsultations.map((consultation) => {
            const patient = getPatientInfo(consultation.patient_id);
            const doctor = getDoctorInfo(consultation.doctor_id);

            return (
              <div key={consultation.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {patient?.first_name} {patient?.last_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(consultation.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Dr.</strong> {doctor?.last_name} - {doctor?.speciality}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Diagnostic: </span>
                        <span className="text-sm text-gray-900">{consultation.diagnosis}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Médicaments prescrits: </span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {consultation.prescriptions.map((prescription: any, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              <Pill className="h-3 w-3 mr-1" />
                              {prescription.medication}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        <span className="font-medium">Contact patient:</span> {patient?.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedConsultation(consultation)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-1"
                      title="Voir l'ordonnance"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Voir</span>
                    </button>
                    <button
                      onClick={() => handlePrintPrescription(consultation)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-1"
                      title="Imprimer l'ordonnance"
                    >
                      <Printer className="h-4 w-4" />
                      <span className="text-sm">Imprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          )}
        </div>

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune ordonnance trouvée</p>
            <p className="text-sm text-gray-400 mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {selectedConsultation && (
        <PrescriptionDetail
          consultation={selectedConsultation}
          onClose={() => setSelectedConsultation(null)}
          onPrint={() => handlePrintPrescription(selectedConsultation)}
        />
      )}
    </>
  );
}