import React from 'react';

interface SceneIconProps {
  name: 'mandate' | 'elections' | 'parliament' | 'arrest' | 'protest' | 'freedom' | 'flag';
  className?: string;
  size?: number;
}

export const SceneIcon: React.FC<SceneIconProps> = ({ name, className = '', size = 36 }) => {
  switch (name) {
    case 'mandate':
      // The Mandate (الانتداب): Hourglass and colonial seal with chains
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M6 2H18M6 22H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 2V6.5C7 8.5 9 10 12 12C15 10 17 8.5 17 6.5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 22V17.5C7 15.5 9 14 12 12C15 14 17 15.5 17 17.5V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          <path d="M10 15L14 15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );

    case 'elections':
      // The Elections (الانتخابات): Ballot box with cedar stamp
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 8H20V20C20 20.6 19.6 21 19 21H5C4.4 21 4 20.6 4 20V8Z" stroke="currentColor" strokeWidth="2" />
          <path d="M2 8L5 4H19L22 8H2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Cedar in ballot slot */}
          <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <polygon points="12,3 9.5,6.5 14.5,6.5" fill="currentColor" />
        </svg>
      );

    case 'parliament':
      // The Parliament (المجلس): Colonnade and dome with constitutional quill
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M2 20H22M4 20V12M8 20V12M12 20V12M16 20V12M20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 12L12 5L22 12H2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 2L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'arrest':
      // The Arrest at Rashaya Citadel (الاعتقال): Fortress battlements and iron gate
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 21H21V10L18 7V4H15V6H13V4H11V6H9V4H6V7L3 10V21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 21V14C9 12.5 10.5 11 12 11C13.5 11 15 12.5 15 14V21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 11V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 16H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'protest':
      // The Demonstrations (المظاهرات): Raised united fists & crowd banners
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 3V12M12 3L9 7M12 3L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 14C5 11.5 7 11 8 11C9 11 10 11.5 10 13V21H4V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 13C14 11.5 15 11 16 11C17 11 19 11.5 19 14V18H20V21H14V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
          <circle cx="16" cy="8" r="2" fill="currentColor" />
        </svg>
      );

    case 'freedom':
      // Freedom (الحرية): Broken shackles & open door
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          {/* Left broken link */}
          <path d="M8 12H4C2.9 12 2 11.1 2 10V6C2 4.9 2.9 4 4 4H8C9.1 4 10 4.9 10 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Right broken link */}
          <path d="M16 12H20C21.1 12 22 12.9 22 14V18C22 19.1 21.1 20 20 20H16C14.9 20 14 19.1 14 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Burst of freedom rays */}
          <path d="M12 5V2M12 22V19M5 19L7 17M19 5L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );

    case 'flag':
      // The Lebanese Flag (العلم): Tricolor waving flag with Cedar
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 22V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="4" y="4" width="17" height="11" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <line x1="4" y1="7.5" x2="21" y2="7.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="4" y1="11.5" x2="21" y2="11.5" stroke="currentColor" strokeWidth="1.5" />
          {/* Miniature Cedar */}
          <polygon points="12.5,8 10.5,11 14.5,11" fill="currentColor" />
          <line x1="12.5" y1="11" x2="12.5" y2="12" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    default:
      return null;
  }
};
