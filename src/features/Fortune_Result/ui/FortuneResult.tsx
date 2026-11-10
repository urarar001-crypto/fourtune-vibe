import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Loading } from '@/shared/UI'
import { UserBirthInfo } from '@/shared/API'

export interface FortuneResultProps {
  is_loading: boolean
  result?: string | null
  prompt?: string
  birthInfo?: UserBirthInfo
  error?: string | null
  onReset?: () => void
}

export const FortuneResult: React.FC<FortuneResultProps> = ({
  is_loading,
  result,
  prompt,
  birthInfo,
  error,
  onReset,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  // 복사할 공유용 텍스트 생성
  const buildShareText = (): string => {
    if (!result) return ''

    let headerInfo = '🔮 [Fortune Vibe · 오늘의 오라클 신탁]\n'
    if (birthInfo && birthInfo.birthYear && birthInfo.birthMonth && birthInfo.birthDay && birthInfo.gender) {
      const genderKr = birthInfo.gender === 'male' ? '남성 ♂️' : '여성 ♀️'
      headerInfo += `✦ 의뢰인: ${birthInfo.birthYear}년 ${birthInfo.birthMonth}월 ${birthInfo.birthDay}일생 (${genderKr})\n`
    }
    if (prompt) {
      headerInfo += `✦ 질문: "${prompt}"\n`
    }
    headerInfo += '───────────────────────────────\n\n'

    const footerInfo = '\n\n───────────────────────────────\n✨ Fortune Vibe에서 나만의 운명을 확인해 보세요!'

    return `${headerInfo}${result}${footerInfo}`
  }

  // 클립보드 복사 핸들러
  const handleCopy = async () => {
    if (!result) return
    const shareText = buildShareText()

    let success = false
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(shareText)
        success = true
      } catch {
        success = false
      }
    }

    if (!success) {
      // Fallback 복사
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        success = document.execCommand('copy')
      } catch {
        success = false
      }
      document.body.removeChild(textArea)
    }

    if (success) {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2500)
    }
  }

  // 모바일/브라우저 네이티브 공유 핸들러 (Web Share API)
  const handleNativeShare = async () => {
    if (!result) return
    const shareText = buildShareText()

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fortune Vibe 오늘의 운세',
          text: shareText,
        })
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopy()
        }
      }
    } else {
      handleCopy()
    }
  }

  // 1. 로딩 상태 화면 (is_loading === true)
  if (is_loading) {
    return (
      <div className="fv-fortune-result fv-fortune-result--loading">
        <Loading
          message="대마법사의 서재에서 고대 비전서를 펼치는 중입니다..."
          subMessage="별자리 점성판과 룬석이 공명하며 오늘의 운세를 비춥니다 🕯️🔮"
        />
      </div>
    )
  }

  // 2. 에러 상태 화면 (error 가 있는 경우)
  if (error && !result) {
    return (
      <div className="fv-fortune-result fv-fortune-result--error">
        <div className="fv-fortune-placeholder" style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
          <div className="fv-fortune-placeholder__icon-wrap">
            <span className="fv-fortune-placeholder__icon">⚠️</span>
          </div>
          <p className="fv-fortune-placeholder__title" style={{ color: '#f87171' }}>
            운명의 신탁을 읽어오지 못했습니다
          </p>
          <p className="fv-fortune-placeholder__desc">{error}</p>
          {onReset && (
            <button
              type="button"
              className="fv-fortune-card__reset-btn"
              onClick={onReset}
              style={{ marginTop: '8px' }}
            >
              🔄 다시 시도하기
            </button>
          )}
        </div>
      </div>
    )
  }

  // 3. 결과가 있을 때의 화면 (result 가 있는 경우 - 복사 및 공유 기능 탑재)
  if (result) {
    const hasBirthInfo =
      birthInfo && birthInfo.birthYear && birthInfo.birthMonth && birthInfo.birthDay && birthInfo.gender

    return (
      <div className="fv-fortune-result fv-fortune-result--ready">
        <div className="fv-fortune-card">
          <div className="fv-fortune-card__filigree-tl" />
          <div className="fv-fortune-card__filigree-tr" />
          <div className="fv-fortune-card__filigree-bl" />
          <div className="fv-fortune-card__filigree-br" />

          <div className="fv-fortune-card__header">
            <div className="fv-fortune-card__seal-wrap">
              <span className="fv-fortune-card__seal">ᛟ ᚱ ᚨ ᚲ ᛚ ᛖ</span>
              <span className="fv-fortune-card__badge">오늘의 오라클 신탁</span>
            </div>

            {hasBirthInfo && (
              <div className="fv-fortune-card__meta">
                <span>✦ 의뢰인 천체 정보:</span>
                <strong>
                  {birthInfo.birthYear}년 {birthInfo.birthMonth}월 {birthInfo.birthDay}일 (
                  {birthInfo.gender === 'male' ? '남성 ♂️' : '여성 ♀️'})
                </strong>
              </div>
            )}

            {prompt && (
              <p className="fv-fortune-card__question">
                <strong>Q.</strong> "{prompt}"
              </p>
            )}
          </div>

          <div className="fv-fortune-card__body">
            <div className="fv-fortune-card__icon-frame">
              <div className="fv-fortune-card__icon">📜</div>
              <span className="fv-fortune-card__icon-label">Daily Arcane</span>
            </div>

            {/* 마크다운 렌더링 영역 */}
            <div className="fv-fortune-card__content fv-markdown-content">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>

          {/* 결과 카드 하단 액션 바: 복사/공유 & 다시 점치기 */}
          <div className="fv-fortune-card__footer">
            <div className="fv-fortune-actions">
              {/* 결과 복사 버튼 */}
              <button
                type="button"
                className={`fv-action-btn fv-action-btn--copy ${isCopied ? 'fv-action-btn--copied' : ''}`}
                onClick={handleCopy}
                title="운세 결과를 클립보드에 복사합니다"
              >
                {isCopied ? (
                  <>
                    <span className="fv-action-btn__icon">✨</span>
                    <span>신탁 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <span className="fv-action-btn__icon">📋</span>
                    <span>운세 복사하기</span>
                  </>
                )}
              </button>

              {/* 네이티브 공유 버튼 (모바일 / 지원 환경) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  className="fv-action-btn fv-action-btn--share"
                  onClick={handleNativeShare}
                  title="SNS 및 메신저로 운세 공유하기"
                >
                  <span className="fv-action-btn__icon">🔗</span>
                  <span>공유하기</span>
                </button>
              )}
            </div>

            {onReset && (
              <button
                type="button"
                className="fv-fortune-card__reset-btn"
                onClick={onReset}
              >
                🕯️ 새로운 질문 점치기
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 4. 아직 결과가 없는 초기 대기 화면
  return (
    <div className="fv-fortune-result fv-fortune-result--empty">
      <div className="fv-fortune-placeholder">
        <div className="fv-fortune-placeholder__icon-wrap">
          <span className="fv-fortune-placeholder__icon">🕯️</span>
          <span className="fv-fortune-placeholder__sparkle">✨</span>
        </div>
        <p className="fv-fortune-placeholder__title">마법사의 서재에 오신 것을 환영합니다</p>
        <p className="fv-fortune-placeholder__desc">
          위 양피지에 생년월일과 성별, 그리고 오늘 하루의 질문을 적고 <strong>[운세 보기]</strong>를 클릭하세요.
          <br />
          어둠 속 촛불 아래에서 고대 오라클이 당신의 탄생 별자리와 운명을 꿰뚫어 보는 금빛 전언을 낭독해 드립니다.
        </p>
        <div className="fv-fortune-placeholder__runes">
          ᛟ · ᚱ · ᚨ · ᚲ · ᛚ · ᛖ · ᚠ · ᛟ · ᚱ · ᛏ · ᚢ · ᚾ · ᛖ
        </div>
      </div>
    </div>
  )
}
