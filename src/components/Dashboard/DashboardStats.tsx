import React from 'react';
import { Users, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: 'Patients Total',
      value: '1,247',
      change: '+12% ce mois',
      changeType: 'increase' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'RDV Aujourd\'hui',
      value: '23',
      change: '5 en attente',
      changeType: 'increase' as const,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Revenus Mensuel',
      value: '847,500 FCFA',
      change: '+8% vs mois dernier',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Stock Critique',
      value: '7',
      change: 'Réappro. urgente',
      changeType: 'decrease' as const,
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}