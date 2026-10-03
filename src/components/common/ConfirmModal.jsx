import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger'
}) => {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || t('confirmDelete')} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <p className="text-slate-600 text-base mb-6">
          {message || t('confirmDelete')}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button variant="outline" fullWidth onClick={onClose}>
            {cancelText || t('cancel')}
          </Button>
          <Button variant={variant} fullWidth onClick={onConfirm}>
            {confirmText || t('delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
