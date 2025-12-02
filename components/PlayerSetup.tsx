'use client';

import { useState } from 'react';

interface PlayerSetupProps {
  onStartGame: (playerNames: string[]) => void;
}

export default function PlayerSetup({ onStartGame }: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

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
    <div className="card bg-base-200/80 backdrop-blur-md border-2 border-primary/30 shadow-2xl max-w-md w-full">
      <div className="card-body">
        <h2 className="card-title text-primary font-[family-name:var(--font-cinzel)] text-2xl">
          Assemble Your Warriors
        </h2>

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
          <ul className="menu bg-base-300 rounded-box mt-4">
            {players.map((player, index) => (
              <li key={index}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{player}</span>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => removePlayer(index)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {players.length === 0 && (
          <p className="text-base-content/60 text-center py-4">
            Add at least one warrior to begin
          </p>
        )}

        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-primary btn-lg font-[family-name:var(--font-cinzel)]"
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
