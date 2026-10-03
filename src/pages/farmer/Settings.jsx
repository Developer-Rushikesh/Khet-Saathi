import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Smartphone, Shield, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Toggle } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Link } from 'react-router-dom';

export const Settings = () => {
  const { t, lang } = useLanguage();
  const { showToast } = useNotifications();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [remindersAudio, setRemindersAudio] = useState(true);

  const handleToggle = (setter, val, label) => {
    setter(val);
    showToast(`${label} updated!`, 'info');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t('settings')}</h1>
        <p className="text-sm text-slate-500 font-medium">Application preferences and offline sync settings</p>
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Preferences</h3>

        <Toggle
          label="SMS & WhatsApp Reminders"
          description="Receive SMS alerts for overdue spray and irrigation tasks"
          checked={smsAlerts}
          onChange={(val) => handleToggle(setSmsAlerts, val, 'SMS Alert Preference')}
        />

        <Toggle
          label="Offline Data Cache"
          description="Keep farm records accessible even without active internet connection"
          checked={offlineSync}
          onChange={(val) => handleToggle(setOfflineSync, val, 'Offline Data Sync')}
        />

        <Toggle
          label="Audio Notification Chime"
          description="Play friendly audio chime when reminder is due"
          checked={remindersAudio}
          onChange={(val) => handleToggle(setRemindersAudio, val, 'Audio Notification')}
        />

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <Globe className="w-5 h-5 text-khet-600" />
            <span>App Language</span>
          </div>
          <Link to="/language" className="text-xs font-bold text-khet-700 hover:underline uppercase">
            {lang} (Change) →
          </Link>
        </div>
      </Card>
    </div>
  );
};
