export default function SblueenergyLogoLarge({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark';

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="200" height="200" fill={isDark ? '#1a1a1a' : '#f5f5f5'} rx="20" />

      {/* Gradient background */}
      <defs>
        <linearGradient id="blueGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0066cc', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00cc99', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Large circle background */}
      <circle cx="100" cy="100" r="90" fill="url(#blueGreen)" opacity="0.1" />

      {/* Energy waves - main design */}
      <g opacity="0.3">
        <path
          d="M 50 100 Q 75 70, 100 100 T 150 100"
          stroke={isDark ? '#ffffff' : '#0066cc'}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 40 120 Q 70 80, 100 120 T 160 120"
          stroke={isDark ? '#ffffff' : '#0066cc'}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Main sun/energy core */}
      <circle cx="100" cy="100" r="30" fill="url(#blueGreen)" />

      {/* Energy rays from center */}
      <g stroke="url(#blueGreen)" strokeWidth="3" strokeLinecap="round">
        <line x1="100" y1="55" x2="100" y2="35" />
        <line x1="100" y1="145" x2="100" y2="165" />
        <line x1="55" y1="100" x2="35" y2="100" />
        <line x1="145" y1="100" x2="165" y2="100" />
        <line x1="70" y1="70" x2="55" y2="55" />
        <line x1="130" y1="130" x2="145" y2="145" />
        <line x1="130" y1="70" x2="145" y2="55" />
        <line x1="70" y1="130" x2="55" y2="145" />
      </g>

      {/* Green leaf accent */}
      <path
        d="M 100 100 L 115 85 Q 125 75, 130 70"
        stroke="#00cc99"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Inner circle */}
      <circle cx="100" cy="100" r="18" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
    </svg>
  );
}
