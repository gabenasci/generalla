'use client';

import { useState, useEffect } from 'react';
import { loadPreviousPlayers } from '@/lib/storage';
import { Shield } from 'lucide-react';

interface PlayerSetupProps {
  onStartGame: (playerNames: string[]) => void;
}

export default function PlayerSetup({ onStartGame }: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [previousPlayers, setPreviousPlayers] = useState<string[] | null>(null);

  useEffect(() => {
    const saved = loadPreviousPlayers();
    setPreviousPlayers(saved);
  }, []);

  const handleUsePreviousPlayers = () => {
    if (previousPlayers) {
      setPlayers(previousPlayers);
    }
  };

  const addPlayer = () => {
    const name = inputValue.trim();
    if (name && !players.includes(name)) {
      setPlayers([...players, name]);
      setInputValue('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlayer();
    }
  };

  const canStart = players.length >= 1;

  return (
    <div className="card bg-base-200/80 backdrop-blur-md border-2 border-primary/30 shadow-2xl max-w-md sm:max-w-lg w-full mx-auto">
      <div className="card-body p-4 sm:p-6">
        <h2 className="card-title text-primary font-[family-name:var(--font-cinzel)] text-xl sm:text-2xl justify-center">
          Assemble Your Warriors
        </h2>

        {previousPlayers && previousPlayers.length > 0 && players.length === 0 && (
          <button
            className="btn btn-secondary btn-md w-full gap-2 font-[family-name:var(--font-cinzel)]"
            onClick={handleUsePreviousPlayers}
          >
            <Shield className="w-4 h-4" />
            Use Previous Warriors
          </button>
        )}

        <div className="form-control">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Enter warrior name..."
              className="input input-bordered join-item flex-1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={20}
            />
            <button
              className="btn btn-primary join-item"
              onClick={addPlayer}
              disabled={!inputValue.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {players.length > 0 && (
          <div className="flex flex-wrap gap-2 bg-base-300 rounded-box p-3 mt-4">
            {players.map((player, index) => (
              <div
                key={index}
                className="badge badge-lg gap-2 bg-primary text-primary-content font-medium py-3 px-4"
              >
                <span>{player}</span>
                <button
                  className="hover:text-error transition-colors"
                  onClick={() => removePlayer(index)}
                  aria-label={`Remove ${player}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {players.length === 0 && (
          <p className="text-base-content/60 text-center py-4">
            Add at least one warrior to begin
          </p>
        )}

        <div className="card-actions justify-center sm:justify-end mt-4">
          <button
            className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto font-[family-name:var(--font-cinzel)]"
            onClick={() => onStartGame(players)}
            disabled={!canStart}
          >
            Begin the Battle
          </button>
        </div>
      </div>
    </div>
  );
}
