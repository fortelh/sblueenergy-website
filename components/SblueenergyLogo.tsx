export default function SblueenergyLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <svg
      className={`${sizeMap[size]} text-blue-600`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="currentColor" opacity="0.1" />

      {/* Blue energy waves */}
      <path
        d="M 20 50 Q 30 40, 40 50 T 60 50 T 80 50"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Green renewable energy indicator */}
      <path
        d="M 35 60 L 50 40 L 65 60"
        fill="#00cc99"
        opacity="0.8"
      />

      {/* Energy rays */}
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
