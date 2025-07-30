import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle, Calendar, Users, Package } from 'lucide-react';

interface NotificationSettingsProps {
  onSettingsChange: () => void;
}

export function NotificationSettings({ onSettingsChange }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      newPatient: true,
      appointmentReminder: true,
      appointmentCancellation: true,
      lowStock: true,
      systemAlerts: true,
      dailyReport: false,
      weeklyReport: true
    },
    sms: {
      enabled: false,
      appointmentReminder: false,
      emergencyAlerts: false
    },
    inApp: {
      enabled: true,
      newPatient: true,
      appointmentReminder: true,
      appointmentCancellation: true,
      lowStock: true,
      systemAlerts: true,
      userActions: false
    },
    schedule: {
      appointmentReminderHours: 24,
      lowStockThreshold: 10,
      reportTime: '08:00',
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    }
  });

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value }
    }));
    onSettingsChange();
  };

  const notificationTypes = [
    {
      id: 'newPatient',
      label: 'Nouveau patient enregistré',
      description: 'Notification lors de l\'ajout d\'un nouveau patient',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 'appointmentReminder',
      label: 'Rappel de rendez-vous',
      description: 'Rappel automatique avant les rendez-vous',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      id: 'appointmentCancellation',
      label: 'Annulation de rendez-vous',
      description: 'Notification en cas d\'annulation',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      id: 'lowStock',
      label: 'Stock faible',
      description: 'Alerte quand le stock est en dessous du seuil',
      icon: Package,
      color: 'text-red-600'
    },
    {
      id: 'systemAlerts',
      label: 'Alertes système',
      description: 'Notifications importantes du système',
      icon: AlertTriangle,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Canaux de notification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">Email</h3>
              <p className="text-sm text-blue-600">Notifications par email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={settings.email.enabled}
                onChange={(e) => handleChange('email', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">SMS</h3>
              <p className="text-sm text-green-600">Notifications par SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={settings.sms.enabled}
                onChange={(e) => handleChange('sms', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">In-App</h3>
              <p className="text-sm text-purple-600">Notifications dans l'app</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={settings.inApp.enabled}
                onChange={(e) => handleChange('inApp', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Types de notifications */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Types de Notifications</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configurez les notifications pour chaque type d'événement
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${type.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{type.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                  <div className="flex space-x-6">
                    {settings.email.enabled && (
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.email[type.id as keyof typeof settings.email] as boolean}
                          onChange={(e) => handleChange('email', type.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Email</span>
                      </label>
                    )}
                    
                    {settings.sms.enabled && ['appointmentReminder', 'emergencyAlerts'].includes(type.id) && (
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.sms[type.id as keyof typeof settings.sms] as boolean}
                          onChange={(e) => handleChange('sms', type.id, e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">SMS</span>
                      </label>
                    )}
                    
                    {settings.inApp.enabled && (
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.inApp[type.id as keyof typeof settings.inApp] as boolean}
                          onChange={(e) => handleChange('inApp', type.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">In-App</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rapports automatiques */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rapports Automatiques</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Rapport quotidien</h4>
              <p className="text-sm text-gray-600">Résumé des activités de la journée</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.dailyReport}
                onChange={(e) => handleChange('email', 'dailyReport', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Rapport hebdomadaire</h4>
              <p className="text-sm text-gray-600">Statistiques et analyses de la semaine</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.weeklyReport}
                onChange={(e) => handleChange('email', 'weeklyReport', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Planification */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">Planification</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rappel RDV (heures avant)
            </label>
            <select
              value={settings.schedule.appointmentReminderHours}
              onChange={(e) => handleChange('schedule', 'appointmentReminderHours', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value={1}>1 heure</option>
              <option value={2}>2 heures</option>
              <option value={4}>4 heures</option>
              <option value={24}>24 heures</option>
              <option value={48}>48 heures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seuil stock faible
            </label>
            <input
              type="number"
              min="1"
              value={settings.schedule.lowStockThreshold}
              onChange={(e) => handleChange('schedule', 'lowStockThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure d'envoi des rapports
            </label>
            <input
              type="time"
              value={settings.schedule.reportTime}
              onChange={(e) => handleChange('schedule', 'reportTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode silencieux
            </label>
            <div className="flex space-x-2">
              <input
                type="time"
                value={settings.schedule.quietHoursStart}
                onChange={(e) => handleChange('schedule', 'quietHoursStart', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <span className="self-center text-gray-500">à</span>
              <input
                type="time"
                value={settings.schedule.quietHoursEnd}
                onChange={(e) => handleChange('schedule', 'quietHoursEnd', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Aucune notification pendant ces heures (sauf urgences)
            </p>
          </div>
        </div>
      </div>

      {/* Test des notifications */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Test des Notifications</h3>
        <p className="text-sm text-blue-700 mb-4">
          Envoyez des notifications de test pour vérifier la configuration
        </p>
        
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Test Email</span>
          </button>
          
          {settings.sms.enabled && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Test SMS</span>
            </button>
          )}
          
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Test In-App</span>
          </button>
        </div>
      </div>
    </div>
  );
}