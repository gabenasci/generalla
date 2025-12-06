'use client';

import { useState, useEffect, useRef } from 'react';
import { UserPlus, X } from 'lucide-react';

interface AddPlayerDialogProps {
  existingNames: string[];
  onAddPlayer: (name: string) => void;
  onClose: () => void;
}

export default function AddPlayerDialog({ existingNames, onAddPlayer, onClose }: AddPlayerDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const name = inputValue.trim();
    if (!name) {
      setError('Enter a warrior name');
      return;
    }
    if (existingNames.some(n => n.toLowerCase() === name.toLowerCase())) {
      setError('This warrior is already in battle');
      return;
    }
    onAddPlayer(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog content */}
      <div className="relative z-10 max-w-md w-full animate-victory-entrance">
        <div className="bg-base-200/95 backdrop-blur-md rounded-2xl border-2 border-primary/50 shadow-2xl p-6 text-center relative">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-base-content/40 hover:text-base-content/80 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <UserPlus className="w-12 h-12 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-accent font-[family-name:var(--font-cinzel)] mb-4 tracking-wider">
            SUMMON WARRIOR
          </h2>

          {/* Input */}
          <div className="form-control mb-4">
            <div className="join w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter warrior name..."
                className={`input input-bordered join-item flex-1 ${error ? 'input-error' : ''}`}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxLength={20}
              />
              <button
                className="btn btn-primary join-item"
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
              >
                Add
              </button>
            </div>
            {error && (
              <label className="label">
                <span className="label-text-alt text-error">{error}</span>
              </label>
            )}
          </div>

          {/* Cancel button */}
          <button
            className="text-sm text-base-content/40 hover:text-base-content/60 transition-colors"
            onClick={onClose}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}
