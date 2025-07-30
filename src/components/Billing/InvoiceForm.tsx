import React, { useState } from 'react';
import { X, Save, Plus, Trash2, User, Calendar, DollarSign, Calculator } from 'lucide-react';
import { Invoice, InvoiceItem, Patient } from '../../types';

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

// Services prédéfinis
const PREDEFINED_SERVICES = [
  { description: 'Consultation générale', unitPrice: 15000 },
  { description: 'Consultation spécialisée', unitPrice: 25000 },
  { description: 'Consultation cardiologique', unitPrice: 30000 },
  { description: 'Consultation pédiatrique', unitPrice: 20000 },
  { description: 'ECG', unitPrice: 15000 },
  { description: 'Échographie', unitPrice: 25000 },
  { description: 'Radiographie', unitPrice: 20000 },
  { description: 'Analyses sanguines', unitPrice: 20000 },
  { description: 'Test de glycémie', unitPrice: 5000 },
  { description: 'Vaccination', unitPrice: 10000 },
  { description: 'Pansement', unitPrice: 3000 },
  { description: 'Injection', unitPrice: 2000 }
];

interface InvoiceFormProps {
  invoice?: Invoice;
  onClose: () => void;
  onSave: (invoice: Partial<Invoice>) => void;
}

export function InvoiceForm({ invoice, onClose, onSave }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    patientId: invoice?.patientId || '',
    date: invoice?.date || new Date().toISOString().split('T')[0],
    appointmentId: invoice?.appointmentId || '',
    status: invoice?.status || 'pending',
    tax: invoice?.tax || 0
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || []
  );

  const [newItem, setNewItem] = useState<InvoiceItem>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + formData.tax;
    
    onSave({
      ...formData,
      items,
      subtotal,
      total
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (field: keyof InvoiceItem, value: string | number) => {
    const updatedItem = { ...newItem, [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
    }
    
    setNewItem(updatedItem);
  };

  const addItem = () => {
    if (newItem.description && newItem.quantity > 0 && newItem.unitPrice > 0) {
      setItems([...items, { ...newItem, total: newItem.quantity * newItem.unitPrice }]);
      setNewItem({
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      });
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const selectPredefinedService = (service: typeof PREDEFINED_SERVICES[0]) => {
    setNewItem({
      ...newItem,
      description: service.description,
      unitPrice: service.unitPrice,
      total: newItem.quantity * service.unitPrice
    });
  };

  const getPatientInfo = (patientId: string) => {
    return MOCK_PATIENTS.find(p => p.id === patientId);
  };

  const selectedPatient = getPatientInfo(formData.patientId);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + formData.tax;

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${month}${random}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {invoice ? 'Modifier la Facture' : 'Nouvelle Facture'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-4">Informations Générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient *
                </label>
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
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de facturation *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de RDV
                </label>
                <input
                  type="text"
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handleChange}
                  placeholder="Optionnel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {selectedPatient && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm flex-1">
                    <div>
                      <span className="font-medium text-gray-700">Patient: </span>
                      <span className="text-gray-900">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Téléphone: </span>
                      <span className="text-gray-900">{selectedPatient.phone}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email: </span>
                      <span className="text-gray-900">{selectedPatient.email || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Services et prestations */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-4">Services et Prestations</h3>

            {/* Services existants */}
            {items.length > 0 && (
              <div className="mb-4">
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Description</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Qté</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Prix unitaire</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Total</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-t border-green-100">
                          <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.unitPrice.toLocaleString()} FCFA</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.total.toLocaleString()} FCFA</td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ajouter un nouveau service */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-gray-800 mb-3">Ajouter un service</h4>
              
              {/* Services prédéfinis */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services prédéfinis
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {PREDEFINED_SERVICES.map((service, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectPredefinedService(service)}
                      className="text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900">{service.description}</div>
                      <div className="text-xs text-gray-500">{service.unitPrice.toLocaleString()} FCFA</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Description du service"
                    value={newItem.description}
                    onChange={(e) => handleItemChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Quantité"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => handleItemChange('quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Prix unitaire"
                    min="0"
                    value={newItem.unitPrice}
                    onChange={(e) => handleItemChange('unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-600">
                  Total: <span className="font-medium">{(newItem.quantity * newItem.unitPrice).toLocaleString()} FCFA</span>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calculs et totaux */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Calculs et Totaux
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxes (FCFA)
                </label>
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="font-medium">{formData.tax.toLocaleString()} FCFA</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-600">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de la facture */}
          {formData.patientId && items.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Résumé de la Facture</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Patient:</strong> {selectedPatient?.firstName} {selectedPatient?.lastName}</p>
                <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('fr-FR')}</p>
                <p><strong>Services:</strong> {items.length} service{items.length > 1 ? 's' : ''}</p>
                <p><strong>Montant total:</strong> {total.toLocaleString()} FCFA</p>
                {!invoice && (
                  <p><strong>Numéro de facture:</strong> {generateInvoiceNumber()}</p>
                )}
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
              disabled={!formData.patientId || items.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{invoice ? 'Mettre à jour' : 'Créer la facture'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}