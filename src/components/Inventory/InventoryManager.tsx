import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { Medicine } from '../../types';

// Mock data
const MOCK_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Paracétamol 500mg',
    category: 'Antalgique',
    manufacturer: 'Pharma Cameroun',
    batchNumber: 'PC2024001',
    expiryDate: '2025-12-31',
    currentStock: 5,
    minStock: 20,
    unitPrice: 250,
    location: 'Étagère A1'
  },
  {
    id: '2',
    name: 'Amoxicilline 250mg',
    category: 'Antibiotique',
    manufacturer: 'MediCam',
    batchNumber: 'MC2024002',
    expiryDate: '2025-06-30',
    currentStock: 45,
    minStock: 30,
    unitPrice: 180,
    location: 'Étagère B2'
  }
];

export function InventoryManager() {
  const [medicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = medicines.filter(medicine => medicine.currentStock <= medicine.minStock);

  return (
    <div className="space-y-6">
      {/* Alertes de stock */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-800">Alerte Stock Critique</h3>
          </div>
          <div className="space-y-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="text-sm text-red-700">
                <strong>{item.name}</strong> - Stock actuel: {item.currentStock}, Minimum: {item.minStock}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Gestion des Stocks</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter Médicament</span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un médicament..."
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
                  Médicament
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix Unitaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedicines.map((medicine) => {
                const isLowStock = medicine.currentStock <= medicine.minStock;
                const daysToExpiry = Math.ceil(
                  (new Date(medicine.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                );
                const isExpiringSoon = daysToExpiry <= 90;

                return (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {medicine.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {medicine.category} - {medicine.manufacturer}
                          </div>
                          <div className="text-xs text-gray-400">
                            Lot: {medicine.batchNumber} | {medicine.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {medicine.currentStock}
                        </span>
                        <span className="text-xs text-gray-500">
                          / {medicine.minStock} min
                        </span>
                        {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine.unitPrice} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isExpiringSoon ? 'text-orange-600' : 'text-gray-900'}`}>
                        {new Date(medicine.expiryDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {daysToExpiry > 0 ? `${daysToExpiry} jours` : 'Expiré'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-800 p-1 rounded transition-colors">
                          <TrendingUp className="h-4 w-4" />
                        </button>
                        <button className="text-orange-600 hover:text-orange-800 p-1 rounded transition-colors">
                          <TrendingDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}