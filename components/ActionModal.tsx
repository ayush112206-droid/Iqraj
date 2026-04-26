'use client';

import React from 'react';
import { X, MessageCircle, ArrowRight, Laptop } from 'lucide-react';
import { WHATSAPP_CHANNEL_URL } from '@/lib/studyiq';

interface ActionModalProps {
  onClose: () => void;
  onContinue: () => void;
  title: string;
  continueText: string;
}

export default function ActionModal({ 
  onClose, 
  onContinue,
  title,
  continueText
}: ActionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border-custom rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-3 hover:text-text-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6 pt-4">
          <h2 className="text-xl font-bold text-text-1">{title}</h2>
          
          <div className="space-y-3">
            <button 
              onClick={onContinue}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary-custom hover:bg-primary-hover text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <Laptop className="w-5 h-5" />
              {continueText}
              <ArrowRight className="w-4 h-4" />
            </button>

            <a 
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              Join WhatsApp Channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
