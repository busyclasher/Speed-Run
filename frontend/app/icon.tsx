import { ImageResponse } from 'next/og'

// Generate favicon dynamically
// To use a custom favicon, add favicon.ico to the /app directory instead

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#2563eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 6,
          fontWeight: 'bold',
        }}
      >
        JB
      </div>
    ),
    {
      ...size,
    }
  )
}
