'use client';

import { Player, getPlayerTotal } from '@/lib/game-state';

interface WinnerBannerProps {
  winners: Player[];
  onNewGame: () => void;
}

export default function WinnerBanner({ winners, onNewGame }: WinnerBannerProps) {
  if (winners.length === 0) return null;

  const isTie = winners.length > 1;
  const winningScore = getPlayerTotal(winners[0]);

  return (
    <div className="alert bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary shadow-lg">
      <div className="flex flex-col items-center w-full text-center gap-2">
        <h2 className="text-3xl font-bold text-primary font-[family-name:var(--font-cinzel)]">
          {isTie ? 'The Battle Ends in a Tie!' : 'Victory!'}
        </h2>
        <p className="text-xl">
          {isTie ? (
            <>
              <span className="font-bold text-primary">
                {winners.map(w => w.name).join(' & ')}
              </span>
              {' '}share glory with{' '}
              <span className="font-bold">{winningScore}</span> points!
            </>
          ) : (
            <>
              <span className="font-bold text-primary">{winners[0].name}</span>
              {' '}claims victory with{' '}
              <span className="font-bold">{winningScore}</span> points!
            </>
          )}
        </p>
        <button
          className="btn btn-primary btn-lg mt-4 font-[family-name:var(--font-cinzel)]"
          onClick={onNewGame}
        >
          New Battle
        </button>
      </div>
    </div>
  );
}
