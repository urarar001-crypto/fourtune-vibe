import { useState } from 'react'
import { UserInput } from '@/features/User_Input'
import { FortuneResult } from '@/features/Fortune_Result'
import { useFortuneAI } from '@/shared/Lib'

export const HomePage = () => {
  // 1. prompt: 사용자가 입력한 질문 텍스트
  const [prompt, setPrompt] = useState<string>('')

  // 2. 사주 / 천체 점성술을 위한 생년, 월, 일, 성별 상태 (Status)
  const [birthYear, setBirthYear] = useState<string>('')
  const [birthMonth, setBirthMonth] = useState<string>('')
  const [birthDay, setBirthDay] = useState<string>('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')

  // 3. 내부 유효성 검사 에러 상태 (입력 요청용)
  const [validationError, setValidationError] = useState<string | null>(null)

  // 4. Gemini API 호출 및 is_loading / error / result 상태를 담당하는 커스텀 훅
  const { result, is_loading, error: apiError, fetchFortune, resetFortune } = useFortuneAI()

  // 화면에 노출할 통합 에러 메시지 (유효성 검사 에러 우선 표시)
  const displayError = validationError || apiError

  // [운세 보기] 버튼을 클릭했을 때의 동작
  const handleFortuneRequest = async () => {
    // 1) 생년월일 입력 여부 검사 (누락 시 입력 요청)
    if (!birthYear || !birthMonth || !birthDay) {
      setValidationError('📜 오라클이 별자리를 읽어낼 수 있도록 태어난 생년, 월, 일을 모두 선택해 주세요!')
      return
    }

    // 2) 성별 입력 여부 검사 (누락 시 입력 요청)
    if (!gender) {
      setValidationError('📜 음양의 조화와 기운을 살필 수 있도록 성별(남성/여성)을 선택해 주세요!')
      return
    }

    // 3) 질문 입력 여부 검사 (누락 시 입력 요청)
    if (!prompt.trim()) {
      setValidationError('📜 양피지에 마음속 질문을 먼저 적어주셔야 운세의 파동을 짚어낼 수 있습니다.')
      return
    }

    // 모든 필수 상태가 충족되면 에러 초기화 및 Gemini API 호출
    setValidationError(null)
    await fetchFortune(prompt, {
      birthYear,
      birthMonth,
      birthDay,
      gender,
    })
  }

  // 상태 초기화 핸들러
  const handleReset = () => {
    setPrompt('')
    setBirthYear('')
    setBirthMonth('')
    setBirthDay('')
    setGender('')
    setValidationError(null)
    resetFortune()
  }

  return (
    <div className="fv-home-page">
      {/* 마법사의 서재 배경 조명 및 마법진 효과 */}
      <div className="fv-bg-glow fv-bg-glow--candle-left" />
      <div className="fv-bg-glow fv-bg-glow--candle-right" />
      <div className="fv-bg-glow fv-bg-glow--arcane-center" />
      <div className="fv-bg-stars" />

      <main className="fv-main-container">
        {/* 헤더 섹션: 마법사의 서재 & 오늘의 운세 타이틀 */}
        <header className="fv-header">
          <div className="fv-header__badge">
            <span className="fv-header__badge-icon">🔮</span>
            <span>THE WIZARD'S SANCTUM · ASTROLOGICAL ORACLE</span>
          </div>

          <h1 className="fv-header__title">
            <span className="fv-text-gold-shine">오늘의 운세</span>
          </h1>

          <div className="fv-header__divider">
            <span className="fv-header__divider-line" />
            <span className="fv-header__divider-gem">✦ ᚱ ✦</span>
            <span className="fv-header__divider-line" />
          </div>

          <p className="fv-header__subtitle">
            은은한 촛불과 고서 향기가 가득한 대마법사의 서재에 당도하셨습니다.
            <br />
            당신의 탄생 별자리와 생년월일, 마음속 질문을 양피지에 새겨 오라클의 계시를 구하세요.
          </p>
        </header>

        {/* 메인 마법서 카드 컨테이너 */}
        <div className="fv-card fv-card--grimoire">
          {/* 모서리 고풍스러운 앤틱 골드 장식 */}
          <div className="fv-card__corner fv-card__corner--tl" />
          <div className="fv-card__corner fv-card__corner--tr" />
          <div className="fv-card__corner fv-card__corner--bl" />
          <div className="fv-card__corner fv-card__corner--br" />

          {/* 1. 사주/탄생 정보 & 질문 입력 영역 */}
          <section className="fv-card__section">
            <UserInput
              prompt={prompt}
              onChangePrompt={(val) => {
                setPrompt(val)
                if (validationError) setValidationError(null)
              }}
              birthYear={birthYear}
              onChangeBirthYear={(val) => {
                setBirthYear(val)
                if (validationError) setValidationError(null)
              }}
              birthMonth={birthMonth}
              onChangeBirthMonth={(val) => {
                setBirthMonth(val)
                if (validationError) setValidationError(null)
              }}
              birthDay={birthDay}
              onChangeBirthDay={(val) => {
                setBirthDay(val)
                if (validationError) setValidationError(null)
              }}
              gender={gender}
              onChangeGender={(val) => {
                setGender(val)
                if (validationError) setValidationError(null)
              }}
              onSubmit={handleFortuneRequest}
              is_loading={is_loading}
              error={displayError}
            />
          </section>

          <div className="fv-card__separator">
            <span className="fv-card__separator-rune">ᛗ ᚨ ᚷ ᛁ ᚲ</span>
          </div>

          {/* 2. 답변 결과 및 로딩 영역 */}
          <section className="fv-card__section">
            <FortuneResult
              is_loading={is_loading}
              result={result}
              prompt={prompt}
              birthInfo={
                birthYear && birthMonth && birthDay && gender
                  ? { birthYear, birthMonth, birthDay, gender }
                  : undefined
              }
              error={displayError}
              onReset={handleReset}
            />
          </section>
        </div>

        {/* 푸터 */}
        <footer className="fv-footer">
          <p className="fv-footer__quote">
            "미래는 쓰여진 양피지가 아니라, 당신의 탄생 별빛과 의지가 빚어내는 조화입니다."
          </p>
          <p className="fv-footer__copy">
            © 2026 오늘의 운세 · Grand Wizard's Arcane Oracle
          </p>
        </footer>
      </main>
    </div>
  )
}
