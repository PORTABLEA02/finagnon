import React, { useState } from 'react';
import { Palette, Monitor, Sun, Moon, Type, Layout, Eye } from 'lucide-react';

interface AppearanceSettingsProps {
  onSettingsChange: () => void;
}

export function AppearanceSettings({ onSettingsChange }: AppearanceSettingsProps) {
  const [settings, setSettings] = useState({
    theme: {
      mode: 'light',
      primaryColor: 'blue',
      accentColor: 'green',
      customColors: {
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b'
      }
    },
    layout: {
      sidebarCollapsed: false,
      compactMode: false,
      showBreadcrumbs: true,
      showQuickActions: true,
      cardStyle: 'elevated'
    },
    typography: {
      fontSize: 'medium',
      fontFamily: 'system',
      lineHeight: 'normal'
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      focusIndicators: true,
      screenReaderOptimized: false
    }
  });

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value }
    }));
    onSettingsChange();
  };

  const colorOptions = [
    { id: 'blue', name: 'Bleu', color: 'bg-blue-500' },
    { id: 'green', name: 'Vert', color: 'bg-green-500' },
    { id: 'purple', name: 'Violet', color: 'bg-purple-500' },
    { id: 'red', name: 'Rouge', color: 'bg-red-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { id: 'teal', name: 'Sarcelle', color: 'bg-teal-500' }
  ];

  const fontOptions = [
    { id: 'system', name: 'Système par défaut' },
    { id: 'inter', name: 'Inter' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'opensans', name: 'Open Sans' }
  ];

  return (
    <div className="space-y-8">
      {/* Thème */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-800">Thème et Couleurs</h3>
        </div>
        
        {/* Mode sombre/clair */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mode d'affichage
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleChange('theme', 'mode', 'light')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                settings.theme.mode === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-sm font-medium">Clair</div>
            </button>
            
            <button
              onClick={() => handleChange('theme', 'mode', 'dark')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                settings.theme.mode === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <div className="text-sm font-medium">Sombre</div>
            </button>
            
            <button
              onClick={() => handleChange('theme', 'mode', 'auto')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                settings.theme.mode === 'auto'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Monitor className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <div className="text-sm font-medium">Auto</div>
            </button>
          </div>
        </div>

        {/* Couleur principale */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Couleur principale
          </label>
          <div className="grid grid-cols-6 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => handleChange('theme', 'primaryColor', color.id)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  settings.theme.primaryColor === color.id
                    ? 'border-gray-400'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${color.color}`}></div>
                <div className="text-xs">{color.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs personnalisées */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Couleurs personnalisées
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Primaire</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.theme.customColors.primary}
                  onChange={(e) => handleChange('theme', 'customColors', {
                    ...settings.theme.customColors,
                    primary: e.target.value
                  })}
                  className="w-10 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.theme.customColors.primary}
                  onChange={(e) => handleChange('theme', 'customColors', {
                    ...settings.theme.customColors,
                    primary: e.target.value
                  })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Secondaire</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.theme.customColors.secondary}
                  onChange={(e) => handleChange('theme', 'customColors', {
                    ...settings.theme.customColors,
                    secondary: e.target.value
                  })}
                  className="w-10 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.theme.customColors.secondary}
                  onChange={(e) => handleChange('theme', 'customColors', {
                    ...settings.theme.customColors,
                    secondary: e.target.value
                  })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Accent</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.theme.customColors.accent}
                  onChange={(e) => handleChange('theme', 'customColors', {
                    ...settings.theme.customColors,
                    accent: e.target.value
                  })}
                  className="w-10 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.theme.customColors.accent}
                  onChange={(e) => handleChange('theme', 'customColors', {
                    ...settings.theme.customColors,
                    accent: e.target.value
                  })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mise en page */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Layout className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Mise en Page</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Style des cartes
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleChange('layout', 'cardStyle', 'flat')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  settings.layout.cardStyle === 'flat'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
                <div className="text-sm font-medium">Plat</div>
              </button>
              
              <button
                onClick={() => handleChange('layout', 'cardStyle', 'elevated')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  settings.layout.cardStyle === 'elevated'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-8 bg-gray-200 rounded shadow-md mb-2"></div>
                <div className="text-sm font-medium">Élevé</div>
              </button>
              
              <button
                onClick={() => handleChange('layout', 'cardStyle', 'outlined')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  settings.layout.cardStyle === 'outlined'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-8 bg-white border-2 border-gray-300 rounded mb-2"></div>
                <div className="text-sm font-medium">Contour</div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.layout.sidebarCollapsed}
                onChange={(e) => handleChange('layout', 'sidebarCollapsed', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                Barre latérale réduite par défaut
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.layout.compactMode}
                onChange={(e) => handleChange('layout', 'compactMode', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                Mode compact (espacement réduit)
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.layout.showBreadcrumbs}
                onChange={(e) => handleChange('layout', 'showBreadcrumbs', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                Afficher le fil d'Ariane
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.layout.showQuickActions}
                onChange={(e) => handleChange('layout', 'showQuickActions', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                Afficher les actions rapides
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Typographie */}
      <div className="bg-purple-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Type className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">Typographie</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille de police
            </label>
            <select
              value={settings.typography.fontSize}
              onChange={(e) => handleChange('typography', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="small">Petite</option>
              <option value="medium">Moyenne</option>
              <option value="large">Grande</option>
              <option value="xlarge">Très grande</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Famille de police
            </label>
            <select
              value={settings.typography.fontFamily}
              onChange={(e) => handleChange('typography', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {fontOptions.map(font => (
                <option key={font.id} value={font.id}>{font.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hauteur de ligne
            </label>
            <select
              value={settings.typography.lineHeight}
              onChange={(e) => handleChange('typography', 'lineHeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="tight">Serrée</option>
              <option value="normal">Normale</option>
              <option value="relaxed">Détendue</option>
              <option value="loose">Lâche</option>
            </select>
          </div>
        </div>

        {/* Aperçu de la typographie */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
          <h4 className="font-semibold text-gray-800 mb-2">Aperçu</h4>
          <div className={`
            ${settings.typography.fontSize === 'small' ? 'text-sm' : 
              settings.typography.fontSize === 'large' ? 'text-lg' :
              settings.typography.fontSize === 'xlarge' ? 'text-xl' : 'text-base'}
            ${settings.typography.lineHeight === 'tight' ? 'leading-tight' :
              settings.typography.lineHeight === 'relaxed' ? 'leading-relaxed' :
              settings.typography.lineHeight === 'loose' ? 'leading-loose' : 'leading-normal'}
          `}>
            <h5 className="font-bold mb-2">Titre de section</h5>
            <p className="mb-2">
              Ceci est un exemple de texte avec les paramètres de typographie sélectionnés. 
              Vous pouvez voir comment la taille de police et la hauteur de ligne affectent la lisibilité.
            </p>
            <p className="text-gray-600">
              Texte secondaire avec une couleur plus claire pour tester le contraste.
            </p>
          </div>
        </div>
      </div>

      {/* Accessibilité */}
      <div className="bg-orange-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-orange-800">Accessibilité</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.accessibility.highContrast}
              onChange={(e) => handleChange('accessibility', 'highContrast', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Mode haut contraste
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.accessibility.reducedMotion}
              onChange={(e) => handleChange('accessibility', 'reducedMotion', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Réduire les animations
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.accessibility.focusIndicators}
              onChange={(e) => handleChange('accessibility', 'focusIndicators', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Indicateurs de focus renforcés
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.accessibility.screenReaderOptimized}
              onChange={(e) => handleChange('accessibility', 'screenReaderOptimized', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Optimisé pour les lecteurs d'écran
            </span>
          </label>
        </div>
      </div>

      {/* Aperçu global */}
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aperçu de l'Interface</h3>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">Exemple de carte</h4>
            <button className={`px-3 py-1 rounded text-sm font-medium ${
              settings.theme.primaryColor === 'blue' ? 'bg-blue-100 text-blue-800' :
              settings.theme.primaryColor === 'green' ? 'bg-green-100 text-green-800' :
              settings.theme.primaryColor === 'purple' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              Action
            </button>
          </div>
          <p className="text-gray-600 mb-3">
            Ceci est un aperçu de l'apparence de l'interface avec vos paramètres actuels.
          </p>
          <div className="flex space-x-2">
            <button className={`px-4 py-2 rounded font-medium ${
              settings.theme.primaryColor === 'blue' ? 'bg-blue-600 text-white' :
              settings.theme.primaryColor === 'green' ? 'bg-green-600 text-white' :
              settings.theme.primaryColor === 'purple' ? 'bg-purple-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              Bouton principal
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50">
              Bouton secondaire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}