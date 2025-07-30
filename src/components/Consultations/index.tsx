import React, { useState } from 'react';
import { ConsultationList } from './ConsultationList';
import { ConsultationForm } from './ConsultationForm';
import { ConsultationDetail } from './ConsultationDetail';
import { MedicalRecord } from '../../types';

export function ConsultationsManager() {
  const [selectedConsultation, setSelectedConsultation] = useState<MedicalRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<MedicalRecord | null>(null);

  const handleSelectConsultation = (consultation: MedicalRecord) => {
    setSelectedConsultation(consultation);
  };

  const handleNewConsultation = () => {
    setEditingConsultation(null);
    setShowForm(true);
  };

  const handleEditConsultation = () => {
    if (selectedConsultation) {
      setEditingConsultation(selectedConsultation);
      setSelectedConsultation(null);
      setShowForm(true);
    }
  };

  const handleSaveConsultation = (consultationData: Partial<MedicalRecord>) => {
    console.log('Saving consultation:', consultationData);
    // TODO: Implement save logic
    setShowForm(false);
    setEditingConsultation(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingConsultation(null);
  };

  const handleCloseDetail = () => {
    setSelectedConsultation(null);
  };

  return (
    <div className="space-y-6">
      <ConsultationList
        onSelectConsultation={handleSelectConsultation}
        onNewConsultation={handleNewConsultation}
      />

      {showForm && (
        <ConsultationForm
          consultation={editingConsultation || undefined}
          onClose={handleCloseForm}
          onSave={handleSaveConsultation}
        />
      )}

      {selectedConsultation && (
        <ConsultationDetail
          consultation={selectedConsultation}
          onClose={handleCloseDetail}
          onEdit={handleEditConsultation}
        />
      )}
    </div>
  );
}