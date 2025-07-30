import React, { useState } from 'react';
import { Server, Database, HardDrive, Wifi, Download, Upload, RefreshCw, AlertCircle } from 'lucide-react';

interface SystemSettingsProps {
  onSettingsChange: () => void;
}

export function SystemSettings({ onSettingsChange }: SystemSettingsProps) {
  const [settings, setSettings] = useState({
    database: {
      host: 'localhost',
      port: 5432,
      name: 'clinicare_db',
      maxConnections: 100,
      backupSchedule: 'daily'
    },
    storage: {
      maxFileSize: 10,
      allowedFileTypes: 'pdf,doc,docx,jpg,jpeg,png',
      storageLocation: 'local',
      cleanupOldFiles: true,
      retentionDays: 365
    },
    performance: {
      cacheEnabled: true,
      cacheTimeout: 3600,
      compressionEnabled: true,
      logLevel: 'info'
    },
    maintenance: {
      autoUpdates: false,
      maintenanceWindow: '02:00',
      maintenanceDuration: 2
    }
  });

  const [systemInfo] = useState({
    version: '1.0.0',
    uptime: '15 jours, 3 heures',
    lastBackup: '2024-01-20 02:00:00',
    diskUsage: 45,
    memoryUsage: 68,
    cpuUsage: 23
  });

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value }
    }));
    onSettingsChange();
  };

  const handleBackupNow = () => {
    console.log('Démarrage de la sauvegarde manuelle...');
    // Logique de sauvegarde
  };

  const handleSystemRestart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir redémarrer le système ? Tous les utilisateurs connectés seront déconnectés.')) {
      console.log('Redémarrage du système...');
      // Logique de redémarrage
    }
  };

  const handleClearCache = () => {
    console.log('Vidage du cache...');
    // Logique de vidage du cache
  };

  return (
    <div className="space-y-8">
      {/* Informations système */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Server className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-800">Informations Système</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Version</div>
            <div className="text-lg font-bold text-gray-900">{systemInfo.version}</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Temps de fonctionnement</div>
            <div className="text-lg font-bold text-gray-900">{systemInfo.uptime}</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Dernière sauvegarde</div>
            <div className="text-sm text-gray-900">{systemInfo.lastBackup}</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Statut</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">En ligne</span>
            </div>
          </div>
        </div>

        {/* Utilisation des ressources */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Utilisation des Ressources</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Disque</span>
                <span className="text-gray-900">{systemInfo.diskUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${systemInfo.diskUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Mémoire</span>
                <span className="text-gray-900">{systemInfo.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${systemInfo.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">CPU</span>
                <span className="text-gray-900">{systemInfo.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${systemInfo.cpuUsage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration base de données */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Base de Données</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serveur
            </label>
            <input
              type="text"
              value={settings.database.host}
              onChange={(e) => handleChange('database', 'host', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port
            </label>
            <input
              type="number"
              value={settings.database.port}
              onChange={(e) => handleChange('database', 'port', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la base
            </label>
            <input
              type="text"
              value={settings.database.name}
              onChange={(e) => handleChange('database', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connexions max
            </label>
            <input
              type="number"
              value={settings.database.maxConnections}
              onChange={(e) => handleChange('database', 'maxConnections', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planification des sauvegardes
          </label>
          <select
            value={settings.database.backupSchedule}
            onChange={(e) => handleChange('database', 'backupSchedule', e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="hourly">Toutes les heures</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>
      </div>

      {/* Stockage et fichiers */}
      <div className="bg-purple-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <HardDrive className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">Stockage et Fichiers</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille max des fichiers (MB)
            </label>
            <input
              type="number"
              value={settings.storage.maxFileSize}
              onChange={(e) => handleChange('storage', 'maxFileSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rétention des fichiers (jours)
            </label>
            <input
              type="number"
              value={settings.storage.retentionDays}
              onChange={(e) => handleChange('storage', 'retentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Types de fichiers autorisés
            </label>
            <input
              type="text"
              value={settings.storage.allowedFileTypes}
              onChange={(e) => handleChange('storage', 'allowedFileTypes', e.target.value)}
              placeholder="pdf,doc,docx,jpg,jpeg,png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Extensions séparées par des virgules
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emplacement de stockage
            </label>
            <select
              value={settings.storage.storageLocation}
              onChange={(e) => handleChange('storage', 'storageLocation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="local">Stockage local</option>
              <option value="cloud">Cloud</option>
              <option value="network">Réseau</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.storage.cleanupOldFiles}
              onChange={(e) => handleChange('storage', 'cleanupOldFiles', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">
              Nettoyer automatiquement les anciens fichiers
            </span>
          </label>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-orange-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Wifi className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-orange-800">Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout du cache (secondes)
            </label>
            <input
              type="number"
              value={settings.performance.cacheTimeout}
              onChange={(e) => handleChange('performance', 'cacheTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de log
            </label>
            <select
              value={settings.performance.logLevel}
              onChange={(e) => handleChange('performance', 'logLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="error">Erreurs seulement</option>
              <option value="warn">Avertissements</option>
              <option value="info">Informations</option>
              <option value="debug">Debug</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.performance.cacheEnabled}
              onChange={(e) => handleChange('performance', 'cacheEnabled', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Activer le cache
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.performance.compressionEnabled}
              onChange={(e) => handleChange('performance', 'compressionEnabled', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Activer la compression
            </span>
          </label>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-red-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <RefreshCw className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Maintenance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fenêtre de maintenance
            </label>
            <input
              type="time"
              value={settings.maintenance.maintenanceWindow}
              onChange={(e) => handleChange('maintenance', 'maintenanceWindow', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée max (heures)
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={settings.maintenance.maintenanceDuration}
              onChange={(e) => handleChange('maintenance', 'maintenanceDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.maintenance.autoUpdates}
              onChange={(e) => handleChange('maintenance', 'autoUpdates', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">
              Mises à jour automatiques
            </span>
          </label>
        </div>

        {/* Actions de maintenance */}
        <div className="border-t border-red-200 pt-6">
          <h4 className="font-medium text-gray-800 mb-4">Actions de Maintenance</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleBackupNow}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Sauvegarde maintenant</span>
            </button>

            <button
              onClick={handleClearCache}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Vider le cache</span>
            </button>

            <button
              onClick={handleSystemRestart}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Redémarrer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alertes système */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <h4 className="font-medium text-yellow-800">Attention</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Les modifications des paramètres système peuvent affecter les performances. 
              Il est recommandé de faire une sauvegarde avant d'apporter des changements importants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}