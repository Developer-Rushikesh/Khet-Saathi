import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea, Select } from '../../components/common/Input';
import { useNotifications } from '../../context/NotificationContext';

export const AdminNotifications = () => {
  const { showToast } = useNotifications();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetDistrict, setTargetDistrict] = useState('All');

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title || !message) {
      showToast('Please enter title and message', 'error');
      return;
    }
    showToast(`Broadcast notification sent to ${targetDistrict} farmers!`, 'success');
    setTitle('');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Broadcast Weather & Crop Alerts</h1>
        <p className="text-sm text-slate-500 font-medium">Send regional advisories or weather warnings to farmers</p>
      </div>

      <Card>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <Select
            label="Target Region"
            value={targetDistrict}
            onChange={(e) => setTargetDistrict(e.target.value)}
            options={['All Districts', 'Satara', 'Sangli', 'Kolhapur', 'Pune']}
          />

          <Input
            label="Alert Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Heavy Rainfall Advisory for Satara"
            required
          />

          <TextArea
            label="Broadcast Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Expect heavy rain in next 48h. Postpone pesticide spray..."
            required
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" icon={Send}>
              Broadcast Alert
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
