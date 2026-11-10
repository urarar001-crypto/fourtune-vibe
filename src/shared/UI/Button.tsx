import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClass = 'fv-button'
  const variantClass = `fv-button--${variant}`
  const sizeClass = `fv-button--${size}`
  const loadingClass = isLoading ? 'fv-button--loading' : ''
  const combinedClass = [baseClass, variantClass, sizeClass, loadingClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={combinedClass}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="fv-button__shimmer" aria-hidden="true" />
      <span className="fv-button__border-glow" aria-hidden="true" />
      {isLoading ? (
        <span className="fv-button__spinner-wrapper">
          <span className="fv-button__spinner" aria-hidden="true" />
          <span>오라클과 교감 중...</span>
        </span>
      ) : (
        <span className="fv-button__content">{children}</span>
      )}
    </button>
  )
}
