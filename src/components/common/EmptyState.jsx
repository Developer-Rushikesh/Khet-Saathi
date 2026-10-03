import React from 'react';
import { Sprout } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../../context/LanguageContext';

export const EmptyState = ({
  icon: Icon = Sprout,
  title,
  description,
  actionText,
  onAction
}) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-200 rounded-2xl my-4">
      <div className="w-16 h-16 rounded-2xl bg-khet-50 text-khet-600 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-1">{title || t('noRecords')}</h4>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>}
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
