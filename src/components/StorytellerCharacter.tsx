import React, { useState, useEffect } from 'react';
import { CharacterEmotion, VisemeShape } from '../types';

interface StorytellerCharacterProps {
  emotion: CharacterEmotion;
  viseme?: VisemeShape;
  isSpeaking: boolean;
  reducedMotion?: boolean;
  onCharacterClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'kiosk';
}

export const StorytellerCharacter: React.FC<StorytellerCharacterProps> = ({
  emotion,
  viseme = 'slight',
  isSpeaking,
  reducedMotion = false,
  onCharacterClick,
  className = '',
  size = 'kiosk'
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [tasselSway, setTasselSway] = useState(0);

  // Natural blinking cycle
  useEffect(() => {
    if (reducedMotion) return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [reducedMotion]);

  // Subtle breathing / head sway when speaking or idle
  useEffect(() => {
    if (reducedMotion) {
      setHeadTilt(0);
      setTasselSway(0);
      return;
    }

    if (emotion === 'joy') {
      const joyTimer = setInterval(() => {
        setHeadTilt(prev => (prev === 4 ? -4 : 4));
        setTasselSway(prev => (prev === 8 ? -8 : 8));
      }, 700);
      return () => clearInterval(joyTimer);
    } else if (emotion === 'angry') {
      setHeadTilt(-2);
      setTasselSway(3);
    } else if (emotion === 'sad') {
      setHeadTilt(3);
      setTasselSway(-2);
    } else if (emotion === 'hopeful') {
      setHeadTilt(-3);
      setTasselSway(4);
    } else {
      setHeadTilt(0);
      setTasselSway(0);
    }
  }, [emotion, reducedMotion]);

  // Dimensions based on size prop
  const getContainerDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-48 h-56';
      case 'md':
        return 'w-64 h-72';
      case 'lg':
        return 'w-80 h-96';
      case 'kiosk':
      default:
        return 'w-72 h-84 md:w-96 md:h-[420px] lg:w-[440px] lg:h-[480px]';
    }
  };

  // Render Mouth according to Viseme & Emotion
  const renderMouth = () => {
    if (!isSpeaking) {
      switch (emotion) {
        case 'joy':
          // Broad joyful smile
          return (
            <path
              d="M 175 220 Q 200 248 225 220 Z"
              fill="#991b1b"
              stroke="#450a0a"
              strokeWidth="2"
            />
          );
        case 'proud':
        case 'hopeful':
          // Warm proud smile
          return (
            <path
              d="M 178 224 Q 200 240 222 224"
              fill="none"
              stroke="#5a1818"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        case 'sad':
          // Downturned mouth
          return (
            <path
              d="M 180 232 Q 200 218 220 232"
              fill="none"
              stroke="#5a1818"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        case 'angry':
          // Tight grimace line
          return (
            <path
              d="M 182 226 L 218 226"
              fill="none"
              stroke="#450a0a"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        case 'shocked':
          // Round O mouth
          return (
            <ellipse
              cx="200"
              cy="226"
              rx="9"
              ry="14"
              fill="#7f1d1d"
              stroke="#450a0a"
              strokeWidth="2.5"
            />
          );
        case 'neutral':
        default:
          return (
            <path
              d="M 180 225 Q 200 234 220 225"
              fill="none"
              stroke="#5a1818"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          );
      }
    }

    // When Speaking: Render Visemes
    switch (viseme) {
      case 'open':
        return (
          <g>
            <path
              d="M 176 218 Q 200 248 224 218 Q 200 238 176 218 Z"
              fill="#881337"
              stroke="#450a0a"
              strokeWidth="2"
            />
            {/* Upper teeth line */}
            <path d="M 184 221 Q 200 226 216 221" stroke="#f8fafc" strokeWidth="2.5" fill="none" />
            {/* Tongue */}
            <ellipse cx="200" cy="236" rx="9" ry="5" fill="#f43f5e" />
          </g>
        );
      case 'wide':
        return (
          <g>
            <ellipse cx="200" cy="225" rx="20" ry="10" fill="#881337" stroke="#450a0a" strokeWidth="2" />
            <path d="M 184 223 L 216 223" stroke="#f8fafc" strokeWidth="3" />
            <ellipse cx="200" cy="229" rx="10" ry="4" fill="#fb7185" />
          </g>
        );
      case 'round':
        return (
          <g>
            <ellipse cx="200" cy="226" rx="12" ry="14" fill="#881337" stroke="#450a0a" strokeWidth="2" />
            <ellipse cx="200" cy="231" rx="6" ry="4" fill="#fb7185" />
          </g>
        );
      case 'teeth':
        return (
          <g>
            <rect x="180" y="221" width="40" height="9" rx="4" fill="#881337" stroke="#450a0a" strokeWidth="2" />
            <rect x="184" y="223" width="32" height="4" fill="#f8fafc" rx="1" />
          </g>
        );
      case 'closed':
        return (
          <path
            d="M 180 225 L 220 225"
            stroke="#5a1818"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      case 'slight':
      default:
        return (
          <ellipse
            cx="200"
            cy="225"
            rx="14"
            ry="7"
            fill="#881337"
            stroke="#450a0a"
            strokeWidth="2"
          />
        );
    }
  };

  // Render Eyebrows according to Emotion
  const renderEyebrows = () => {
    switch (emotion) {
      case 'joy':
        return (
          <g stroke="#3e2723" strokeWidth="5.5" strokeLinecap="round" fill="none">
            {/* Right eyebrow (viewer's left) */}
            <path d="M 166 142 Q 182 128 198 140" />
            {/* Left eyebrow (viewer's right) */}
            <path d="M 202 140 Q 218 128 234 142" />
          </g>
        );
      case 'proud':
        return (
          <g stroke="#3e2723" strokeWidth="5.5" strokeLinecap="round" fill="none">
            <path d="M 165 140 Q 182 130 197 141" />
            <path d="M 203 141 Q 218 130 235 140" />
          </g>
        );
      case 'hopeful':
        return (
          <g stroke="#3e2723" strokeWidth="5.5" strokeLinecap="round" fill="none">
            {/* Lifted in the center */}
            <path d="M 167 146 Q 184 132 198 139" />
            <path d="M 202 139 Q 216 132 233 146" />
          </g>
        );
      case 'shocked':
        return (
          <g stroke="#3e2723" strokeWidth="5.5" strokeLinecap="round" fill="none">
            {/* Raised very high */}
            <path d="M 165 132 Q 182 118 198 130" />
            <path d="M 202 130 Q 218 118 235 132" />
          </g>
        );
      case 'sad':
        return (
          <g stroke="#3e2723" strokeWidth="5.5" strokeLinecap="round" fill="none">
            {/* Inner ends pulled up, outer ends down */}
            <path d="M 167 150 Q 182 140 198 135" />
            <path d="M 202 135 Q 218 140 233 150" />
          </g>
        );
      case 'angry':
        return (
          <g stroke="#3e2723" strokeWidth="6" strokeLinecap="round" fill="none">
            {/* V-angled inward fiercely */}
            <path d="M 165 136 Q 182 144 198 149" />
            <path d="M 202 149 Q 218 144 235 136" />
          </g>
        );
      case 'neutral':
      default:
        return (
          <g stroke="#3e2723" strokeWidth="5.5" strokeLinecap="round" fill="none">
            <path d="M 166 142 Q 182 136 197 143" />
            <path d="M 203 143 Q 218 136 234 142" />
          </g>
        );
    }
  };

  // Render Eyes
  const renderEyes = () => {
    if (isBlinking) {
      return (
        <g stroke="#3e2723" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M 172 165 Q 182 170 192 165" />
          <path d="M 208 165 Q 218 170 228 165" />
        </g>
      );
    }

    if (emotion === 'joy') {
      // Squinting happy arc eyes
      return (
        <g stroke="#3e2723" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 172 166 Q 182 155 192 166" />
          <path d="M 208 166 Q 218 155 228 166" />
          {/* Laugh crinkles */}
          <path d="M 168 163 L 164 161" strokeWidth="2.5" />
          <path d="M 232 163 L 236 161" strokeWidth="2.5" />
        </g>
      );
    }

    if (emotion === 'shocked') {
      // Wide open rounded eyes
      return (
        <g>
          {/* Eyeballs */}
          <ellipse cx="182" cy="164" rx="12" ry="13" fill="#ffffff" stroke="#3e2723" strokeWidth="2.5" />
          <ellipse cx="218" cy="164" rx="12" ry="13" fill="#ffffff" stroke="#3e2723" strokeWidth="2.5" />
          {/* Pupils dilated */}
          <circle cx="182" cy="164" r="5" fill="#1c1917" />
          <circle cx="218" cy="164" r="5" fill="#1c1917" />
          {/* Light gleam */}
          <circle cx="180" cy="162" r="2" fill="#ffffff" />
          <circle cx="216" cy="162" r="2" fill="#ffffff" />
        </g>
      );
    }

    // Default & other emotions
    let pupilOffsetY = 0;
    let pupilOffsetX = 0;
    if (emotion === 'hopeful') {
      pupilOffsetY = -2.5;
    } else if (emotion === 'sad') {
      pupilOffsetY = 3;
    }

    return (
      <g>
        {/* Eye whites */}
        <ellipse cx="182" cy="164" rx="11" ry="8" fill="#ffffff" stroke="#3e2723" strokeWidth="2" />
        <ellipse cx="218" cy="164" rx="11" ry="8" fill="#ffffff" stroke="#3e2723" strokeWidth="2" />
        {/* Iris (warm Lebanese hazel-brown) */}
        <circle cx={182 + pupilOffsetX} cy={164 + pupilOffsetY} r="5.5" fill="#78350f" />
        <circle cx={218 + pupilOffsetX} cy={164 + pupilOffsetY} r="5.5" fill="#78350f" />
        {/* Pupils */}
        <circle cx={182 + pupilOffsetX} cy={164 + pupilOffsetY} r="3" fill="#0f172a" />
        <circle cx={218 + pupilOffsetX} cy={164 + pupilOffsetY} r="3" fill="#0f172a" />
        {/* Eye highlights */}
        <circle cx={180 + pupilOffsetX} cy={162 + pupilOffsetY} r="1.5" fill="#ffffff" />
        <circle cx={216 + pupilOffsetX} cy={162 + pupilOffsetY} r="1.5" fill="#ffffff" />
      </g>
    );
  };

  // Render Arms & Gestures according to Emotion
  const renderArms = () => {
    switch (emotion) {
      case 'joy':
        // Both arms raised high in triumphant victory celebration!
        return (
          <g>
            {/* Right Arm (raised up-left) */}
            <path
              d="M 140 280 Q 95 240 85 190 Q 75 180 85 170 Q 98 180 115 220 L 155 285"
              fill="#1e3a8a"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Right Hand */}
            <circle cx="85" cy="175" r="14" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
            <path d="M 82 165 L 82 178 M 87 165 L 87 178 M 92 168 L 92 180" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />

            {/* Left Arm (raised up-right with Lebanese flag ribbon) */}
            <path
              d="M 260 280 Q 305 240 315 190 Q 325 180 315 170 Q 302 180 285 220 L 245 285"
              fill="#1e3a8a"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Left Hand */}
            <circle cx="315" cy="175" r="14" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
            {/* Small cedar branch in hand */}
            <path d="M 315 170 L 330 140" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="325,145 335,135 340,150" fill="#16a34a" />
          </g>
        );

      case 'proud':
        // Right hand placed firmly over chest/heart in the traditional salute of Lebanese honor
        return (
          <g>
            {/* Left Arm relaxed holding staff or at side */}
            <path
              d="M 255 280 Q 295 320 290 370"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <circle cx="288" cy="375" r="14" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />

            {/* Right Arm folded over chest */}
            <path
              d="M 145 280 Q 140 330 180 320 L 210 300"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Right Hand on heart with Lebanese ribbon */}
            <g transform="translate(195, 290)">
              <ellipse cx="10" cy="10" rx="15" ry="12" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" transform="rotate(-15, 10, 10)" />
              <path d="M 3 6 Q 12 12 20 6" stroke="#7c2d12" strokeWidth="2" fill="none" />
            </g>
          </g>
        );

      case 'hopeful':
        // One hand raised forward in an welcoming / inspiring storytelling pose
        return (
          <g>
            {/* Left Arm at side */}
            <path
              d="M 255 280 Q 285 320 280 370"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <circle cx="278" cy="375" r="14" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />

            {/* Right Arm extended forward */}
            <path
              d="M 145 280 Q 110 300 100 270"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Open palm gesture */}
            <circle cx="95" cy="265" r="15" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
            <path d="M 85 260 Q 95 250 105 260" stroke="#7c2d12" strokeWidth="2" fill="none" />
          </g>
        );

      case 'angry':
        // Right hand clenched in a defiant fist against oppression!
        return (
          <g>
            {/* Left Arm tensed */}
            <path
              d="M 255 280 Q 285 305 280 345"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <circle cx="280" cy="350" r="14" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />

            {/* Right Arm raised with clenched fist */}
            <path
              d="M 145 280 Q 105 270 105 220"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Clenched Fist */}
            <g transform="translate(93, 205)">
              <rect x="0" y="0" width="24" height="22" rx="7" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
              <path d="M 6 0 L 6 12 M 12 0 L 12 14 M 18 0 L 18 12" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        );

      case 'shocked':
        // Both hands pulled back in disbelief
        return (
          <g>
            <path
              d="M 145 280 Q 110 250 120 210"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <circle cx="120" cy="205" r="15" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />

            <path
              d="M 255 280 Q 290 250 280 210"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <circle cx="280" cy="205" r="15" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
          </g>
        );

      case 'sad':
        // Drooping low arms
        return (
          <g>
            <path
              d="M 145 285 Q 140 345 150 395"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <circle cx="150" cy="400" r="13" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />

            <path
              d="M 255 285 Q 260 345 250 395"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <circle cx="250" cy="400" r="13" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
          </g>
        );

      case 'neutral':
      default:
        // Gentle relaxed storytelling posture
        return (
          <g>
            {/* Left Arm */}
            <path
              d="M 255 280 Q 285 320 275 365"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <circle cx="275" cy="370" r="14" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />

            {/* Right Arm welcoming gesture */}
            <path
              d="M 145 280 Q 115 320 125 365"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <circle cx="125" cy="370" r="14" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
          </g>
        );
    }
  };

  return (
    <div
      onClick={onCharacterClick}
      className={`relative flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-[1.02] ${getContainerDimensions()} ${className}`}
      title="انقر على الحكواتي أبو رفيق للتفاعل!"
    >
      <svg
        viewBox="50 40 300 400"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        aria-label="الحكواتي اللبناني الأصيل أبو رفيق"
      >
        <defs>
          {/* Tarboush Crimson Gradient */}
          <linearGradient id="tarboushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="60%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          {/* Skin Tone Gradient */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>

          {/* Vest Navy Gradient */}
          <linearGradient id="vestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Golden Embroidery */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Ambient Halo behind Character */}
        <ellipse
          cx="200"
          cy="260"
          rx="120"
          ry="140"
          fill="rgba(220, 38, 38, 0.08)"
          className="transition-colors duration-700"
        />

        {/* ARMS (Behind body layer) */}
        {renderArms()}

        {/* BODY / TORSO */}
        <g id="torso">
          {/* White traditional shirt / collar */}
          <path
            d="M 140 270 L 260 270 L 275 420 L 125 420 Z"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          {/* Traditional Vest (صدرية مطرزة) */}
          <path
            d="M 140 270 Q 200 290 260 270 L 270 415 L 225 415 L 200 320 L 175 415 L 130 415 Z"
            fill="url(#vestGrad)"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          {/* Golden vest trim / embroidery (قصب مذهب) */}
          <path
            d="M 140 270 Q 200 290 260 270"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="4"
          />
          <path
            d="M 200 320 L 175 415 M 200 320 L 225 415"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
          />

          {/* Golden vest buttons */}
          <circle cx="200" cy="340" r="3.5" fill="url(#goldGrad)" />
          <circle cx="200" cy="365" r="3.5" fill="url(#goldGrad)" />
          <circle cx="200" cy="390" r="3.5" fill="url(#goldGrad)" />

          {/* Cedar pin on vest lapel */}
          <g transform="translate(165, 305) scale(0.6)">
            <polygon points="12,2 2,18 22,18" fill="#15803d" />
            <polygon points="12,10 4,24 20,24" fill="#16a34a" />
            <polygon points="12,18 5,30 19,30" fill="#22c55e" />
            <rect x="10.5" y="30" width="3" height="6" fill="#78350f" />
          </g>

          {/* White Shirt Collar */}
          <polygon points="185,260 200,280 170,270" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <polygon points="215,260 200,280 230,270" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
        </g>

        {/* HEAD GROUP (with tilting and breathing) */}
        <g
          id="head"
          style={{
            transform: `rotate(${headTilt}deg)`,
            transformOrigin: '200px 240px',
            transition: reducedMotion ? 'none' : 'transform 0.4s ease-out'
          }}
        >
          {/* Neck */}
          <rect
            x="185"
            y="235"
            width="30"
            height="35"
            rx="5"
            fill="url(#skinGrad)"
            stroke="#ea580c"
            strokeWidth="1.5"
          />

          {/* Ears */}
          <ellipse cx="145" cy="180" rx="10" ry="14" fill="url(#skinGrad)" stroke="#ea580c" strokeWidth="2" />
          <path d="M 143 175 Q 146 180 144 185" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />

          <ellipse cx="255" cy="180" rx="10" ry="14" fill="url(#skinGrad)" stroke="#ea580c" strokeWidth="2" />
          <path d="M 257 175 Q 254 180 256 185" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />

          {/* Face Base */}
          <path
            d="M 150 160 Q 150 110 200 110 Q 250 110 250 160 Q 250 230 200 245 Q 150 230 150 160 Z"
            fill="url(#skinGrad)"
            stroke="#ea580c"
            strokeWidth="2"
          />

          {/* Cheeks (warm rosy tint for friendly elder) */}
          <circle cx="165" cy="188" r="12" fill="rgba(239, 68, 68, 0.16)" />
          <circle cx="235" cy="188" r="12" fill="rgba(239, 68, 68, 0.16)" />

          {/* Nose (distinguished, dignified Lebanese nose) */}
          <path
            d="M 200 160 L 195 195 Q 200 200 205 195 Z"
            fill="url(#skinGrad)"
            stroke="#d97706"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 191 193 Q 200 198 209 193"
            fill="none"
            stroke="#b45309"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Eyebrows */}
          {renderEyebrows()}

          {/* Eyes */}
          {renderEyes()}

          {/* Traditional Lebanese Mustache (شارب أصيل أنيق) */}
          <g id="mustache" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.25))">
            <path
              d="M 200 210 Q 175 204 158 218 Q 175 224 198 214 Z"
              fill="#271c19"
            />
            <path
              d="M 200 210 Q 225 204 242 218 Q 225 224 202 214 Z"
              fill="#271c19"
            />
            {/* Center connector */}
            <circle cx="200" cy="212" r="3" fill="#271c19" />
          </g>

          {/* Mouth (Visemes & Emotion) */}
          {renderMouth()}

          {/* TARBOUSH (الطربوش اللبناني الأحمر) */}
          <g id="tarboush" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.35))">
            {/* Main Red Body (Truncated Cone) */}
            <path
              d="M 152 120 L 164 55 Q 200 50 236 55 L 248 120 Q 200 130 152 120 Z"
              fill="url(#tarboushGrad)"
              stroke="#5f0c0c"
              strokeWidth="2.5"
            />

            {/* Tarboush Top Oval */}
            <ellipse
              cx="200"
              cy="55"
              rx="36"
              ry="11"
              fill="#991b1b"
              stroke="#5f0c0c"
              strokeWidth="2"
            />

            {/* Black Button / Rivet on Top */}
            <ellipse
              cx="200"
              cy="54"
              rx="6"
              ry="3"
              fill="#18181b"
            />

            {/* Black Silk Tassel (الشرابة الحريرية السوداء) */}
            <g
              id="tassel"
              style={{
                transform: `rotate(${tasselSway}deg)`,
                transformOrigin: '200px 54px',
                transition: reducedMotion ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              {/* String */}
              <path
                d="M 200 54 Q 225 60 238 85"
                fill="none"
                stroke="#18181b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Knot / Cap */}
              <circle cx="238" cy="85" r="4.5" fill="#09090b" />
              {/* Silken Tassel Strands flowing over side */}
              <path
                d="M 235 88 L 244 140 L 250 142 L 242 88 Z"
                fill="#18181b"
                opacity="0.95"
              />
              <path
                d="M 237 88 L 230 138 L 236 140 L 240 88 Z"
                fill="#27272a"
              />
              <path
                d="M 239 88 L 248 135 L 254 137 L 243 88 Z"
                fill="#09090b"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* Subtle Speaking Indicator Pulse */}
      {isSpeaking && !reducedMotion && (
        <div className="absolute -bottom-2 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>عمّو رفيق يتحدّث...</span>
        </div>
      )}
    </div>
  );
};
