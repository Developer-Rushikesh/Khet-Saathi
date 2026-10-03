import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Tractor, MapPin, ArrowLeft, Sprout, Clock, Plus } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const FarmDetails = () => {
  const { farmId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [farm, setFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const f = await mockApi.getFarmById(farmId);
        const c = await mockApi.getCrops();
        const a = await mockApi.getActivities();
        setFarm(f);
        setCrops(c.filter(item => item.farmId === farmId));
        setActivities(a.filter(item => item.farmId === farmId));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmId]);

  if (loading) return <LoadingSpinner message="Loading farm details..." />;
  if (!farm) return <div className="p-8 text-center text-slate-500">Farm not found.</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Back Button */}
      <button
        onClick={() => navigate('/farms')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Farms</span>
      </button>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 overflow-hidden">
        {farm.image && (
          <img src={farm.image} alt={farm.name} className="w-full h-56 object-cover rounded-2xl mb-5" />
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-khet-100 text-khet-800 font-bold text-xs">
                {farm.area} {farm.unit}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-khet-600" />
                {farm.village}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{farm.name}</h1>
          </div>

          <Button variant="primary" icon={Plus} onClick={() => navigate('/add-activity', { state: { farmId: farm.id } })}>
            + Record Activity Here
          </Button>
        </div>

        {farm.notes && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600">
            <strong>Notes:</strong> {farm.notes}
          </div>
        )}
      </div>

      {/* Crops on this Farm */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Active Crops on this Farm ({crops.length})</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/crops')}>
            + Add Crop
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crops.map((crop) => (
            <Card key={crop.id} hoverable onClick={() => navigate(`/crops/${crop.id}`)}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-bold text-slate-900">🌾 {crop.name}</h4>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                  {crop.season}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 mt-2">
                <p>Variety: <strong>{crop.variety}</strong></p>
                <p>Sowing Date: <strong>{crop.sowingDate}</strong></p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
