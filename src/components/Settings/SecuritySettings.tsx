import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, Clock, Key, Database } from 'lucide-react';

interface SecuritySettingsProps {
  onSettingsChange: () => void;
}

export function SecuritySettings({ onSettingsChange }: SecuritySettingsProps) {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90
    },
    sessionSettings: {
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
      requireReauth: true
    },
    auditSettings: {
      logUserActions: true,
      logDataAccess: true,
      logSystemChanges: true,
      retentionDays: 365
    },
    backupSettings: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      encryptBackups: true
    },
    accessControl: {
      enableTwoFactor: false,
      allowRemoteAccess: true,
      ipWhitelist: '',
      blockAfterFailedAttempts: 5
    }
  });

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value }
    }));
    onSettingsChange();
  };

  return (
    <div className="space-y-8">
      {/* Politique de mots de passe */}
      <div className="bg-red-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lock className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Politique de Mots de Passe</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longueur minimale
            </label>
            <input
              type="number"
              min="6"
              max="20"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => handleChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration (jours)
            </label>
            <select
              value={settings.passwordPolicy.passwordExpiry}
              onChange={(e) => handleChange('passwordPolicy', 'passwordExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={30}>30 jours</option>
              <option value={60}>60 jours</option>
              <option value={90}>90 jours</option>
              <option value={180}>180 jours</option>
              <option value={365}>1 an</option>
              <option value={0}>Jamais</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireUppercase}
              onChange={(e) => handleChange('passwordPolicy', 'requireUppercase', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Exiger des majuscules</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireLowercase}
              onChange={(e) => handleChange('passwordPolicy', 'requireLowercase', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Exiger des minuscules</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireNumbers}
              onChange={(e) => handleChange('passwordPolicy', 'requireNumbers', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Exiger des chiffres</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireSpecialChars}
              onChange={(e) => handleChange('passwordPolicy', 'requireSpecialChars', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Exiger des caractères spéciaux</span>
          </label>
        </div>
      </div>

      {/* Gestion des sessions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-800">Gestion des Sessions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout de session (minutes)
            </label>
            <select
              value={settings.sessionSettings.sessionTimeout}
              onChange={(e) => handleChange('sessionSettings', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
              <option value={480}>8 heures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sessions simultanées max
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.sessionSettings.maxConcurrentSessions}
              onChange={(e) => handleChange('sessionSettings', 'maxConcurrentSessions', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.sessionSettings.requireReauth}
              onChange={(e) => handleChange('sessionSettings', 'requireReauth', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Exiger une ré-authentification pour les actions sensibles
            </span>
          </label>
        </div>
      </div>

      {/* Contrôle d'accès */}
      <div className="bg-purple-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">Contrôle d'Accès</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blocage après tentatives échouées
              </label>
              <select
                value={settings.accessControl.blockAfterFailedAttempts}
                onChange={(e) => handleChange('accessControl', 'blockAfterFailedAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={3}>3 tentatives</option>
                <option value={5}>5 tentatives</option>
                <option value={10}>10 tentatives</option>
                <option value={0}>Jamais</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liste blanche IP (une par ligne)
            </label>
            <textarea
              value={settings.accessControl.ipWhitelist}
              onChange={(e) => handleChange('accessControl', 'ipWhitelist', e.target.value)}
              rows={4}
              placeholder="192.168.1.0/24&#10;10.0.0.0/8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Laisser vide pour autoriser toutes les adresses IP
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.accessControl.enableTwoFactor}
                onChange={(e) => handleChange('accessControl', 'enableTwoFactor', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">
                Activer l'authentification à deux facteurs (2FA)
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.accessControl.allowRemoteAccess}
                onChange={(e) => handleChange('accessControl', 'allowRemoteAccess', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">
                Autoriser l'accès à distance
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Audit et journalisation */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-800">Audit et Journalisation</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rétention des logs (jours)
            </label>
            <select
              value={settings.auditSettings.retentionDays}
              onChange={(e) => handleChange('auditSettings', 'retentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={180}>180 jours</option>
              <option value={365}>1 an</option>
              <option value={1095}>3 ans</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.auditSettings.logUserActions}
              onChange={(e) => handleChange('auditSettings', 'logUserActions', e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700">
              Journaliser les actions des utilisateurs
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.auditSettings.logDataAccess}
              onChange={(e) => handleChange('auditSettings', 'logDataAccess', e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700">
              Journaliser l'accès aux données patients
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.auditSettings.logSystemChanges}
              onChange={(e) => handleChange('auditSettings', 'logSystemChanges', e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700">
              Journaliser les modifications système
            </span>
          </label>
        </div>
      </div>

      {/* Sauvegarde et récupération */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Sauvegarde et Récupération</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fréquence de sauvegarde
            </label>
            <select
              value={settings.backupSettings.backupFrequency}
              onChange={(e) => handleChange('backupSettings', 'backupFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="hourly">Toutes les heures</option>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rétention des sauvegardes (jours)
            </label>
            <select
              value={settings.backupSettings.retentionDays}
              onChange={(e) => handleChange('backupSettings', 'retentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={365}>1 an</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.backupSettings.autoBackup}
              onChange={(e) => handleChange('backupSettings', 'autoBackup', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">
              Sauvegarde automatique activée
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.backupSettings.encryptBackups}
              onChange={(e) => handleChange('backupSettings', 'encryptBackups', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">
              Chiffrer les sauvegardes
            </span>
          </label>
        </div>
      </div>

      {/* Résumé de sécurité */}
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Niveau de Sécurité</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">Élevé</div>
            <div className="text-sm text-gray-600">Mots de passe</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Moyen</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">Élevé</div>
            <div className="text-sm text-gray-600">Audit</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">
              Recommandation: Activez l'authentification à deux facteurs pour renforcer la sécurité
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}