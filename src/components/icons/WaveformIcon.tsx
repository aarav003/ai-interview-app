import React from 'react';

interface WaveformIconProps {
  isAnimating: boolean;
  className?: string;
}

const styleSheet = `
.waveform-bar {
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
  transform: scaleY(0.2);
}
.waveform-bar.animating {
  animation: wave 1.5s infinite ease-in-out;
}
@keyframes wave {
  0%, 100% { transform: scaleY(0.2); }
  50% { transform: scaleY(1); }
}
.waveform-bar:nth-child(1).animating { animation-delay: 0s; }
.waveform-bar:nth-child(2).animating { animation-delay: 0.2s; }
.waveform-bar:nth-child(3).animating { animation-delay: 0.4s; }
.waveform-bar:nth-child(4).animating { animation-delay: 0.6s; }
.waveform-bar:nth-child(5).animating { animation-delay: 0.8s; }
`;

export const WaveformIcon: React.FC<WaveformIconProps> = ({ isAnimating, className }) => {
  const barClass = `waveform-bar ${isAnimating ? 'animating' : ''}`;
  
  return (
    <>
      <style>{styleSheet}</style>
      <svg
        width="54"
        height="24"
        viewBox="0 0 54 24"
        className={className}
        fill="currentColor"
        aria-hidden="true"
      >
        <rect className={barClass} x="0" y="0" width="6" height="24" rx="3" />
        <rect className={barClass} x="12" y="0" width="6" height="24" rx="3" />
        <rect className={barClass} x="24" y="0" width="6" height="24" rx="3" />
        <rect className={barClass} x="36" y="0" width="6" height="24" rx="3" />
        <rect className={barClass} x="48" y="0" width="6" height="24" rx="3" />
      </svg>
    </>
  );
};