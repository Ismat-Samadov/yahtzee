'use client';

interface DiceFaceProps {
  value: 1 | 2 | 3 | 4 | 5 | 6;
  held: boolean;
  isRolling: boolean;
  size?: number;
}

// Grid positions: 0=top-left, 1=top-center, 2=top-right,
//                 3=mid-left, 4=mid-center, 5=mid-right,
//                 6=bot-left, 7=bot-center, 8=bot-right
const PIP_POSITIONS: Record<number, number[]> = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 3, 6, 2, 5, 8],
};

export function DiceFace({ value, held, isRolling, size = 64 }: DiceFaceProps) {
  const activePips = PIP_POSITIONS[value] || [];
  const pipSize = Math.round(size * 0.15);

  const borderColor = held
    ? '#00ff88'
    : isRolling
    ? '#a855f7'
    : 'rgba(0,212,255,0.4)';

  const shadowColor = held
    ? '0 0 16px rgba(0,255,136,0.6), 0 0 4px rgba(0,255,136,0.4)'
    : isRolling
    ? '0 0 16px rgba(168,85,247,0.6)'
    : '0 0 8px rgba(0,212,255,0.2)';

  return (
    <div
      style={{
        width: size,
        height: size,
        background: held
          ? 'rgba(0,255,136,0.08)'
          : 'rgba(10,10,15,0.9)',
        border: `2px solid ${borderColor}`,
        borderRadius: Math.round(size * 0.18),
        boxShadow: shadowColor,
        padding: Math.round(size * 0.1),
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: Math.round(size * 0.04),
        transition: 'all 0.15s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer overlay when rolling */}
      {isRolling && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, transparent 40%, rgba(168,85,247,0.15) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 0.5s linear infinite',
            borderRadius: 'inherit',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {activePips.includes(i) && (
            <div
              style={{
                width: pipSize,
                height: pipSize,
                borderRadius: '50%',
                background: held
                  ? '#00ff88'
                  : isRolling
                  ? '#a855f7'
                  : '#00d4ff',
                boxShadow: held
                  ? `0 0 ${pipSize}px rgba(0,255,136,0.8)`
                  : isRolling
                  ? `0 0 ${pipSize}px rgba(168,85,247,0.8)`
                  : `0 0 ${pipSize}px rgba(0,212,255,0.6)`,
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
