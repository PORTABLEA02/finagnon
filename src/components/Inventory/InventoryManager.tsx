import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, TrendingDown, TrendingUp, Filter, Stethoscope, Pill, Wrench, TestTube, Ban as Bandage } from 'lucide-react';
import { Medicine } from '../../types';
import { ProductForm } from './ProductForm';

// Mock data avec tous types de produits médicaux
const MOCK_MEDICINES: Medicine[] = [
  // Médicaments
  {
    id: '1',
    name: 'Paracétamol 500mg',
    category: 'medication',
    manufacturer: 'Pharma Cameroun',
    batchNumber: 'PC2024001',
    expiryDate: '2025-12-31',
    currentStock: 5,
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
    currentStock: 45,
    minStock: 30,
    unitPrice: 180,
    location: 'Pharmacie - Étagère B2',
    unit: 'boîte',
    description: 'Antibiotique à large spectre'
  },
  // Fournitures médicales
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
    currentStock: 8,
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
  // Équipements
  {
    id: '6',
    name: 'Thermomètre digital',
    category: 'equipment',
    manufacturer: 'MedTech',
    batchNumber: 'MT2024006',
    expiryDate: '2027-01-15',
    currentStock: 3,
    minStock: 5,
    unitPrice: 15000,
    location: 'Cabinet médical',
    unit: 'pièce',
    description: 'Thermomètre électronique médical'
  },
  // Consommables
  {
    id: '7',
    name: 'Alcool médical 70°',
    category: 'consumable',
    manufacturer: 'ChemMed',
    batchNumber: 'CM2024007',
    expiryDate: '2025-09-10',
    currentStock: 12,
    minStock: 8,
    unitPrice: 2500,
    location: 'Salle de soins - Armoire 3',
    unit: 'litre',
    description: 'Solution désinfectante'
  },
  {
    id: '8',
    name: 'Coton hydrophile',
    category: 'consumable',
    manufacturer: 'CottonCare',
    batchNumber: 'CC2024008',
    expiryDate: '2026-12-31',
    currentStock: 6,
    minStock: 10,
    unitPrice: 1500,
    location: 'Salle de soins - Étagère D1',
    unit: 'paquet 500g',
    description: 'Coton médical stérile'
  },
  // Matériel de diagnostic
  {
    id: '9',
    name: 'Bandelettes test glucose',
    category: 'diagnostic',
    manufacturer: 'DiagnoTest',
    batchNumber: 'DT2024009',
    expiryDate: '2025-04-30',
    currentStock: 2,
    minStock: 5,
    unitPrice: 8500,
    location: 'Laboratoire - Réfrigérateur',
    unit: 'boîte de 50',
    description: 'Test rapide de glycémie'
  }
];

const CATEGORY_LABELS = {
  medication: 'Médicaments',
  'medical-supply': 'Fournitures médicales',
  equipment: 'Équipements',
  consumable: 'Consommables',
  diagnostic: 'Matériel diagnostic'
};

const CATEGORY_ICONS = {
  medication: Pill,
  'medical-supply': Bandage,
  equipment: Stethoscope,
  consumable: Package,
  diagnostic: TestTube
};

const CATEGORY_COLORS = {
  medication: 'bg-blue-100 text-blue-800',
  'medical-supply': 'bg-green-100 text-green-800',
  equipment: 'bg-purple-100 text-purple-800',
  consumable: 'bg-orange-100 text-orange-800',
  diagnostic: 'bg-red-100 text-red-800'
};

export function InventoryManager() {
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Medicine | null>(null);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = medicines.filter(medicine => medicine.currentStock <= medicine.minStock);
  const expiringSoonItems = medicines.filter(medicine => {
    const daysToExpiry = Math.ceil(
      (new Date(medicine.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return daysToExpiry <= 90 && daysToExpiry > 0;
  });

  const getCategoryStats = () => {
    const stats = Object.keys(CATEGORY_LABELS).map(category => {
      const items = medicines.filter(m => m.category === category);
      const lowStock = items.filter(m => m.currentStock <= m.minStock).length;
      return {
        category,
        total: items.length,
        lowStock
      };
    });
    return stats;
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Medicine) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = (productData: Partial<Medicine>) => {
    if (editingProduct) {
      // Mise à jour d'un produit existant
      setMedicines(medicines.map(medicine => 
        medicine.id === editingProduct.id 
          ? { ...medicine, ...productData }
          : medicine
      ));
    } else {
      // Ajout d'un nouveau produit
      const newProduct: Medicine = {
        id: Date.now().toString(),
        ...productData as Medicine
      };
      setMedicines([...medicines, newProduct]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <>
      <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Produits</p>
              <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Critique</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expire Bientôt</p>
              <p className="text-2xl font-bold text-orange-600">{expiringSoonItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valeur Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {medicines.reduce((total, item) => total + (item.currentStock * item.unitPrice), 0).toLocaleString()} FCFA
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Alertes */}
      {(lowStockItems.length > 0 || expiringSoonItems.length > 0) && (
        <div className="space-y-4">
          {lowStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-800">Alerte Stock Critique ({lowStockItems.length} produits)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lowStockItems.slice(0, 6).map(item => (
                  <div key={item.id} className="text-sm text-red-700 bg-white rounded p-2">
                    <strong>{item.name}</strong> - Stock: {item.currentStock} {item.unit} (Min: {item.minStock})
                  </div>
                ))}
              </div>
              {lowStockItems.length > 6 && (
                <p className="text-sm text-red-600 mt-2">... et {lowStockItems.length - 6} autres produits</p>
              )}
            </div>
          )}

          {expiringSoonItems.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h3 className="font-medium text-orange-800">Produits expirant bientôt ({expiringSoonItems.length} produits)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {expiringSoonItems.slice(0, 4).map(item => {
                  const daysToExpiry = Math.ceil(
                    (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                  );
                  return (
                    <div key={item.id} className="text-sm text-orange-700 bg-white rounded p-2">
                      <strong>{item.name}</strong> - Expire dans {daysToExpiry} jours
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistiques par catégorie */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition par Catégorie</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {getCategoryStats().map(stat => {
            const Icon = CATEGORY_ICONS[stat.category as keyof typeof CATEGORY_ICONS];
            return (
              <div key={stat.category} className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">
                  {CATEGORY_LABELS[stat.category as keyof typeof CATEGORY_LABELS]}
                </p>
                <p className="text-lg font-bold text-gray-900">{stat.total}</p>
                {stat.lowStock > 0 && (
                  <p className="text-xs text-red-600">{stat.lowStock} en rupture</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Inventaire Médical</h2>
            <button 
              onClick={handleAddProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter Produit</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit, fabricant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
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
                const Icon = CATEGORY_ICONS[medicine.category];

                return (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {medicine.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {medicine.manufacturer}
                          </div>
                          <div className="text-xs text-gray-400">
                            Lot: {medicine.batchNumber} | {medicine.location}
                          </div>
                          {medicine.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {medicine.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[medicine.category]}`}>
                        {CATEGORY_LABELS[medicine.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {medicine.currentStock} {medicine.unit}
                        </span>
                        <span className="text-xs text-gray-500">
                          / {medicine.minStock} min
                        </span>
                        {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine.unitPrice.toLocaleString()} FCFA
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
                        <button 
                          className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                          title="Entrée de stock"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-orange-600 hover:text-orange-800 p-1 rounded transition-colors"
                          title="Sortie de stock"
                        >
                          <TrendingDown className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(medicine)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                          title="Modifier"
                        >
                          <Package className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct || undefined}
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
        />
      )}
    </>
  );
}