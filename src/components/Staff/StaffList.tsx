import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Shield, User, Mail, Phone, Calendar, Clock, UserCheck, UserX } from 'lucide-react';
import { User as UserType } from '../../types';

// Extended mock data for staff
const MOCK_STAFF: (UserType & {
  department: string;
  hireDate: string;
  salary: number;
  workSchedule: string;
  emergencyContact: string;
  address: string;
  status: 'active' | 'inactive' | 'on-leave';
  lastLogin: string;
})[] = [
  {
    id: '1',
    email: 'admin@clinique.com',
    firstName: 'Dr. Marie',
    lastName: 'Durand',
    role: 'admin',
    phone: '+237 690 000 001',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    department: 'Administration',
    hireDate: '2023-01-15',
    salary: 2500000,
    workSchedule: 'Temps plein',
    emergencyContact: '+237 690 000 011',
    address: 'Yaoundé, Quartier Bastos',
    status: 'active',
    lastLogin: '2024-01-20T08:30:00Z'
  },
  {
    id: '2',
    email: 'dr.martin@clinique.com',
    firstName: 'Dr. Paul',
    lastName: 'Martin',
    role: 'doctor',
    speciality: 'Cardiologie',
    phone: '+237 690 000 002',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    department: 'Médecine',
    hireDate: '2023-03-01',
    salary: 3000000,
    workSchedule: 'Temps plein',
    emergencyContact: '+237 690 000 012',
    address: 'Yaoundé, Quartier Melen',
    status: 'active',
    lastLogin: '2024-01-20T07:45:00Z'
  },
  {
    id: '3',
    email: 'secretaire@clinique.com',
    firstName: 'Sophie',
    lastName: 'Mbala',
    role: 'secretary',
    phone: '+237 690 000 003',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    department: 'Accueil',
    hireDate: '2023-06-15',
    salary: 800000,
    workSchedule: 'Temps plein',
    emergencyContact: '+237 690 000 013',
    address: 'Yaoundé, Quartier Nlongkak',
    status: 'active',
    lastLogin: '2024-01-19T17:30:00Z'
  },
  {
    id: '4',
    email: 'dr.kouam@clinique.com',
    firstName: 'Dr. Jean',
    lastName: 'Kouam',
    role: 'doctor',
    speciality: 'Médecine générale',
    phone: '+237 690 000 004',
    isActive: false,
    createdAt: '2024-01-15T00:00:00Z',
    department: 'Médecine',
    hireDate: '2023-09-01',
    salary: 2200000,
    workSchedule: 'Temps partiel',
    emergencyContact: '+237 690 000 014',
    address: 'Douala, Akwa',
    status: 'on-leave',
    lastLogin: '2024-01-10T16:20:00Z'
  },
  {
    id: '5',
    email: 'infirmiere@clinique.com',
    firstName: 'Claire',
    lastName: 'Nkomo',
    role: 'secretary', // Using secretary role as we don't have nurse role
    phone: '+237 690 000 005',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    department: 'Soins infirmiers',
    hireDate: '2023-04-10',
    salary: 1200000,
    workSchedule: 'Temps plein',
    emergencyContact: '+237 690 000 015',
    address: 'Yaoundé, Quartier Emana',
    status: 'active',
    lastLogin: '2024-01-20T06:00:00Z'
  }
];

interface StaffListProps {
  onSelectStaff: (staff: UserType) => void;
  onNewStaff: () => void;
  onEditStaff: (staff: UserType) => void;
}

export function StaffList({ onSelectStaff, onNewStaff, onEditStaff }: StaffListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [staff, setStaff] = useState(MOCK_STAFF);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(staff.map(s => s.department))];

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrateur',
      doctor: 'Médecin',
      secretary: 'Personnel soignant'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      doctor: 'bg-blue-100 text-blue-800',
      secretary: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      'on-leave': 'En congé'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      'on-leave': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleToggleStatus = (staffId: string) => {
    setStaff(staff.map(member => 
      member.id === staffId 
        ? { 
            ...member, 
            status: member.status === 'active' ? 'inactive' : 'active',
            isActive: member.status !== 'active'
          }
        : member
    ));
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
      setStaff(staff.filter(member => member.id !== staffId));
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('fr-FR').format(salary) + ' FCFA';
  };

  const formatLastLogin = (lastLogin: string) => {
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Gestion du Personnel</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gérer les employés de la clinique et leurs informations
            </p>
          </div>
          <button
            onClick={onNewStaff}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Personnel</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Personnel</p>
                <p className="text-2xl font-bold text-blue-900">{staff.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Actifs</p>
                <p className="text-2xl font-bold text-green-900">
                  {staff.filter(s => s.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Médecins</p>
                <p className="text-2xl font-bold text-blue-900">
                  {staff.filter(s => s.role === 'doctor').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">En congé</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {staff.filter(s => s.status === 'on-leave').length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="doctor">Médecins</option>
              <option value="secretary">Personnel soignant</option>
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="on-leave">En congé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Département
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {member.firstName[0]}{member.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      {member.speciality && (
                        <div className="text-sm text-gray-500">
                          {member.speciality}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        Embauché le {new Date(member.hireDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{member.department}</div>
                    <div className="text-xs text-gray-500">{member.workSchedule}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(member.id)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${getStatusColor(member.status)}`}
                  >
                    {getStatusLabel(member.status)}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatLastLogin(member.lastLogin)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onSelectStaff(member)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="Voir le profil"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditStaff(member)}
                      className="text-gray-600 hover:text-gray-800 p-1 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun membre du personnel trouvé</p>
          <p className="text-sm text-gray-400 mt-1">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}