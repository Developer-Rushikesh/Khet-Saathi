import React, { useState } from 'react';
import { Camera, Upload, Trash2, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { Button } from './Button';

export const ImageUploader = ({ label = 'Upload Photo / Receipt', value, onChange, enableMockOcr = false, onOcrResult }) => {
  const [loading, setLoading] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setOcrSuccess(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          onChange(reader.result);
          setLoading(false);
          if (enableMockOcr && onOcrResult) {
            setOcrSuccess(true);
            onOcrResult({
              detectedProduct: 'Emamectin Benzoate 5% SG',
              detectedAmount: '₹1,800',
              detectedDate: new Date().toISOString().split('T')[0]
            });
          }
        }, 600);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setOcrSuccess(false);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
          <img src={value} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 bg-rose-600/90 text-white rounded-full hover:bg-rose-700 transition-colors shadow-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {ocrSuccess && (
            <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Smart OCR extracted details automatically!</span>
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 hover:border-khet-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-khet-50/30 transition-all p-4 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-khet-600">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-xs font-semibold">Uploading & Processing...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-500">
              <div className="p-3 bg-white rounded-full shadow-sm text-khet-600">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Click to upload photo or take picture</span>
              <span className="text-xs text-slate-400">Supports JPG, PNG, WEBP (Max 5MB)</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
};
