import React from 'react'

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  showCharCount = false,
  maxLength,
  value,
  disabled,
  className = '',
  rows = 4,
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0

  return (
    <div className={`fv-textarea-wrapper ${disabled ? 'fv-textarea-wrapper--disabled' : ''}`}>
      {label && <label className="fv-textarea-label">{label}</label>}
      <textarea
        className={`fv-textarea ${error ? 'fv-textarea--error' : ''} ${className}`}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        {...props}
      />
      <div className="fv-textarea-footer">
        {error ? (
          <span className="fv-textarea-error">{error}</span>
        ) : (
          helperText && <span className="fv-textarea-helper">{helperText}</span>
        )}
        {showCharCount && maxLength && (
          <span className="fv-textarea-counter">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
