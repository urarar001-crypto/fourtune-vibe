import React from 'react'

export interface MysticWheelIconProps {
  className?: string
  size?: number
}

/**
 * 신비스러운 운명의 수레바퀴 (Wheel of Fortune) 아이콘 컴포넌트
 * 고대 점성술의 8방위 스포크, 외곽 룬 링, 내부 옥타그램 별이 회전하는 정교한 마법 휠 SVG
 */
export const MysticWheelIcon: React.FC<MysticWheelIconProps> = ({
  className = '',
  size = 64,
}) => {
  return (
    <div
      className={`fv-mystic-wheel-wrap ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="fv-mystic-wheel-glow" />
      <svg
        className="fv-mystic-wheel-svg"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 황금빛 메탈릭 그라데이션 */}
          <linearGradient id="wheelGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="75%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          {/* 아케인 바이올렛 & 앰버 그라데이션 */}
          <radialGradient id="wheelCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#d97706" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. 최외곽 룬 링 (천천히 정방향 회전) */}
        <g className="fv-wheel-spin-slow">
          {/* 외곽 이중 테두리 */}
          <circle cx="50" cy="50" r="46" stroke="url(#wheelGoldGrad)" strokeWidth="1.5" />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#wheelGoldGrad)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* 8방위 외곽 룬 노드 (작은 원형 마법석) */}
          <circle cx="50" cy="5" r="2.2" fill="#ffd700" />
          <circle cx="50" cy="95" r="2.2" fill="#ffd700" />
          <circle cx="5" cy="50" r="2.2" fill="#ffd700" />
          <circle cx="95" cy="50" r="2.2" fill="#ffd700" />
          <circle cx="18.2" cy="18.2" r="1.8" fill="#fde047" />
          <circle cx="81.8" cy="81.8" r="1.8" fill="#fde047" />
          <circle cx="18.2" cy="81.8" r="1.8" fill="#fde047" />
          <circle cx="81.8" cy="18.2" r="1.8" fill="#fde047" />

          {/* 8방위 바퀴살 (Spokes) */}
          <line x1="50" y1="12" x2="50" y2="88" stroke="url(#wheelGoldGrad)" strokeWidth="1.5" />
          <line x1="12" y1="50" x2="88" y2="50" stroke="url(#wheelGoldGrad)" strokeWidth="1.5" />
          <line x1="23.1" y1="23.1" x2="76.9" y2="76.9" stroke="url(#wheelGoldGrad)" strokeWidth="1.2" />
          <line x1="23.1" y1="76.9" x2="76.9" y2="23.1" stroke="url(#wheelGoldGrad)" strokeWidth="1.2" />

          {/* 중간 룬 링 */}
          <circle cx="50" cy="50" r="28" stroke="url(#wheelGoldGrad)" strokeWidth="1.2" />
        </g>

        {/* 2. 내부 옥타그램 (8각 마법별 - 역방향 회전) */}
        <g className="fv-wheel-spin-reverse">
          <circle cx="50" cy="50" r="18" fill="url(#wheelCenterGlow)" />
          {/* 두 개의 겹쳐진 사각형 (8각성) */}
          <polygon
            points="50,34 61.3,38.7 66,50 61.3,61.3 50,66 38.7,61.3 34,50 38.7,38.7"
            stroke="url(#wheelGoldGrad)"
            strokeWidth="1.2"
            fill="none"
          />
          <polygon
            points="50,31 55,45 69,50 55,55 50,69 45,55 31,50 45,45"
            fill="#ffd700"
            opacity="0.75"
          />
        </g>

        {/* 3. 정중앙 오라클 아이 코어 */}
        <circle cx="50" cy="50" r="4.5" fill="#fffbeb" />
        <circle cx="50" cy="50" r="2" fill="#78350f" />
      </svg>
    </div>
  )
}
