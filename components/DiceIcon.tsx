'use client';

interface DiceIconProps {
  value: 1 | 2 | 3 | 4 | 5 | 6;
  size?: number;
  className?: string;
}

// Pip positions for each dice value (in a 24x24 viewBox)
const PIP_POSITIONS: Record<number, [number, number][]> = {
  1: [[12, 12]],
  2: [[7, 7], [17, 17]],
  3: [[7, 7], [12, 12], [17, 17]],
  4: [[7, 7], [17, 7], [7, 17], [17, 17]],
  5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]],
  6: [[7, 6], [7, 12], [7, 18], [17, 6], [17, 12], [17, 18]],
};

export default function DiceIcon({ value, size = 20, className = '' }: DiceIconProps) {
  const pips = PIP_POSITIONS[value] || [];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-label={`Dice showing ${value}`}
    >
      {/* Dice background - cream/off-white */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="3"
        fill="#f5f0e6"
      />
      {/* Pips - black */}
      {pips.map(([cx, cy], index) => (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r="2.5"
          fill="#1a1a1a"
        />
      ))}
    </svg>
  );
}
