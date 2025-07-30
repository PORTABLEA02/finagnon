import React, { useState } from 'react';
import { Search, Plus, Edit, Package, AlertTriangle, Calendar, TrendingDown, Filter, Eye } from 'lucide-react';
import { Medicine } from '../../types';

// Mock inventory data
const MOCK_INVENTORY: Medicine[] = [
  {
    id: '1',
    name: 'Paracétamol 500mg',
    category: 'medication',
    manufacturer: 'Pharma Cameroun',
    batchNumber: 'PC2024001',
    expiryDate: '2025-12-31',
    currentStock: 50,
    minStock: 20,
    unitPrice: 250,
    location: 'Pharmacie - Étagère A1',
    unit: 'boîte',
    description: 'Antalgique et antipyrétique'
  },
  {
    id: '2',
    name: 'Amoxicilline 250mg',
    category: 'medication',
    manufacturer: 'MediCam',
    batchNumber: 'MC2024002',
    expiryDate: '2025-06-30',
    currentStock: 15,
    minStock: 30,
    unitPrice: 180,
    location: 'Pharmacie - Étagère B2',
    unit: 'boîte',
    description: 'Antibiotique à large spectre'
  },
  {
    id: '3',
    name: 'Seringues jetables 5ml',
    category: 'medical-supply',
    manufacturer: 'MedSupply',
    batchNumber: 'MS2024003',
    expiryDate: '2026-03-15',
    currentStock: 150,
    minStock: 100,
    unitPrice: 50,
    location: 'Salle de soins - Armoire 1',
    unit: 'pièce',
    description: 'Seringues stériles à usage unique'
  },
  {
    id: '4',
    name: 'Gants latex stériles',
    category: 'medical-supply',
    manufacturer: 'SafeHands',
    batchNumber: 'SH2024004',
    expiryDate: '2025-08-20',
    currentStock: 5,
    minStock: 20,
    unitPrice: 1200,
    location: 'Salle de soins - Armoire 2',
    unit: 'boîte de 100',
    description: 'Gants d\'examen en latex poudrés'
  },
  {
    id: '5',
    name: 'Compresses stériles 10x10cm',
    category: 'medical-supply',
    manufacturer: 'SterileSupply',
    batchNumber: 'SS2024005',
    expiryDate: '2025-11-30',
    currentStock: 25,
    minStock: 15,
    unitPrice: 800,
    location: 'Salle de soins - Étagère C1',
    unit: 'paquet de 50',
    description: 'Compresses de gaze stériles'
  },
  {
    id: '6',
    name: 'Alcool médical 70°',
    category: 'consumable',
    manufacturer: 'ChemMed',
    batchNumber: 'CM2024007',
    expiryDate: '2025-09-10',
    currentStock: 8,
    minStock: 8,
    unitPrice: 2500,
    location: 'Salle de soins - Armoire 3',
    unit: 'litre',
    description: 'Solution désinfectante'
  }
];

const CATEGORY_LABELS = {
  medication: 'Médicaments',
  'medical-supply': 'Fournitures médicales',
  equipment: 'Équipements',
  consumable: 'Consommables',
  diagnostic: 'Matériel diagnostic'
};

const CATEGORY_COLORS = {
  medication: 'bg-blue-100 text-blue-800',
  'medical-supply': 'bg-green-100 text-green-800',
  equipment: 'bg-purple-100 text-purple-800',
  consumable: 'bg-yellow-100 text-yellow-800',
  diagnostic: 'bg-red-100 text-red-800'
};

interface ProductListProps {
  onSelectProduct: (product: Medicine) => void;
  onNewProduct: () => void;
  onEditProduct: (product: Medicine) => void;
  onStockMovement: (product: Medicine) => void;
}

export function ProductList({ onSelectProduct, onNewProduct, onEditProduct, onStockMovement }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [inventory, setInventory] = useState<Medicine[]>(MOCK_INVENTORY);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'low-stock':
        matchesFilter = item.currentStock <= item.minStock;
        break;
      case 'expiring':
        const daysToExpiry = Math.ceil(
          (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
        );
        matchesFilter = daysToExpiry <= 90 && daysToExpiry > 0;
        break;
      case 'expired':
        matchesFilter = new Date(item.expiryDate) < new Date();
        break;
    }
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const getStockStatus = (item: Medicine) => {
    if (item.currentStock <= 0) return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    if (item.currentStock <= item.minStock) return { label: 'Stock faible', color: 'bg-orange-100 text-orange-800' };
    return { label: 'En stock', color: 'bg-green-100 text-green-800' };
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysToExpiry = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    
    if (daysToExpiry < 0) return { label: 'Expiré', color: 'bg-red-100 text-red-800' };
    if (daysToExpiry <= 30) return { label: 'Expire bientôt', color: 'bg-orange-100 text-orange-800' };
    if (daysToExpiry <= 90) return { label: 'À surveiller', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Valide', color: 'bg-green-100 text-green-800' };
  };

  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const lowStockItems = filteredInventory.filter(item => item.currentStock <= item.minStock).length;
  const expiringItems = filteredInventory.filter(item => {
    const daysToExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return daysToExpiry <= 90 && daysToExpiry > 0;
  }).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Gestion de l'Inventaire</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gérer les médicaments et fournitures médicales
            </p>
          </div>
          <button
            onClick={onNewProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Produit</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Produits</p>
                <p className="text-2xl font-bold text-blue-900">{filteredInventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Valeur Stock</p>
                <p className="text-2xl font-bold text-green-900">{Math.round(totalValue / 1000)}K FCFA</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Stock Faible</p>
                <p className="text-2xl font-bold text-orange-900">{lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Expire Bientôt</p>
                <p className="text-2xl font-bold text-red-900">{expiringItems}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, fabricant ou emplacement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Toutes catégories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tous les produits</option>
              <option value="low-stock">Stock faible</option>
              <option value="expiring">Expire bientôt</option>
              <option value="expired">Expirés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emplacement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              const expiryStatus = getExpiryStatus(item.expiryDate);
              
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.manufacturer} - {item.batchNumber}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
                          {CATEGORY_LABELS[item.category]}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.currentStock} {item.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: {item.minStock} {item.unit}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.unitPrice.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-gray-500">
                      Valeur: {(item.currentStock * item.unitPrice).toLocaleString()} FCFA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(item.expiryDate).toLocaleDateString('fr-FR')}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
                      {expiryStatus.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSelectProduct(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditProduct(item)}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onStockMovement(item)}
                        className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                        title="Mouvement de stock"
                      >
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

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun produit trouvé</p>
          <p className="text-sm text-gray-400 mt-1">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}