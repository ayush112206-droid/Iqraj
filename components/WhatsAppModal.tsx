'use client';

import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { WHATSAPP_CHANNEL_URL } from '@/lib/studyiq';

interface WhatsAppModalProps {
  onClose: () => void;
  title?: string;
  buttonText?: string;
  showIcon?: boolean;
}

export default function WhatsAppModal({ 
  onClose, 
  title = "Join WhatsApp Channel", 
  buttonText = "Join Now",
  showIcon = false
}: WhatsAppModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border-custom rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-3 hover:text-text-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          {showIcon && (
             <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
               <MessageCircle className="w-8 h-8 text-green-500" />
             </div>
          )}
          <h2 className="text-xl font-bold text-text-1">{title}</h2>
          
          <a 
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all active:scale-95 text-center"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}
