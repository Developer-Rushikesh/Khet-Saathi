import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ActivityTimeline } from '../../components/timeline/ActivityTimeline';

export const ActivityHistory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [aData, cData] = await Promise.all([mockApi.getActivities(), mockApi.getCrops()]);
        setActivities(aData);
        setCrops(cData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching activity history timeline..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('activities')}</h1>
          <p className="text-sm text-slate-500 font-medium">Digital timeline of all recorded sowing, spray, irrigation & fertilizer work</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/add-activity')}>
          {t('addActivity')}
        </Button>
      </div>

      <ActivityTimeline
        activities={activities}
        crops={crops}
        onSelectActivity={(act) => navigate(`/activities/${act.id}`)}
      />
    </div>
  );
};
