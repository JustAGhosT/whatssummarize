"use client"

export function EnhancedBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
        width="100vw"
        height="100vh"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="960" cy="540" rx="800" ry="400" fill="#00a884" fillOpacity="0.1" />
        {/* Add more shapes as needed */}
      </svg>
      {/* Add more SVGs here, each with absolute positioning and full viewport size if needed */}
    </div>
  );
}
