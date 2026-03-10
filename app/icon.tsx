import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export const runtime = 'edge';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0a0a0f',
          borderRadius: 8,
          border: '2px solid #00d4ff',
          display: 'flex',
          flexWrap: 'wrap' as const,
          padding: 4,
          gap: 3,
          alignContent: 'space-between',
          justifyContent: 'space-between',
        }}
      >
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              background: '#00d4ff',
              borderRadius: '50%',
            }}
          />
        ))}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 6,
              height: 6,
              background: '#00d4ff',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
