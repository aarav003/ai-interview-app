
import React from 'react';

interface VideoIconProps {
  className?: string;
  off?: boolean;
}

export const VideoIcon: React.FC<VideoIconProps> = ({ className, off = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z"></path>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    {off && <line x1="1" y1="1" x2="23" y2="23"></line>}
  </svg>
);