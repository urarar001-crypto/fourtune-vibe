import React from 'react'

export interface LoadingProps {
  message?: string
  subMessage?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({
  message = '오라클의 고대 수정구가 빛을 발하고 있습니다...',
  subMessage = '마법사의 서재에 흩어진 별자리와 운명의 서표를 맞추는 중입니다 📜✨',
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`fv-loading fv-loading--${size} ${className}`} role="status" aria-live="polite">
      <div className="fv-loading__orb-container">
        <div className="fv-loading__magic-circle fv-loading__magic-circle--outer" />
        <div className="fv-loading__magic-circle fv-loading__magic-circle--inner" />
        <div className="fv-loading__orb-glow" />
        <div className="fv-loading__orb">
          <span className="fv-loading__eye">👁️‍🗨️</span>
        </div>
      </div>
      {message && <p className="fv-loading__message">{message}</p>}
      {subMessage && <p className="fv-loading__sub-message">{subMessage}</p>}
    </div>
  )
}
