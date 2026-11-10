import React, { useMemo } from 'react'
import { Button, TextArea } from '@/shared/UI'

export interface UserInputProps {
  prompt: string
  onChangePrompt: (val: string) => void
  birthYear: string
  onChangeBirthYear: (val: string) => void
  birthMonth: string
  onChangeBirthMonth: (val: string) => void
  birthDay: string
  onChangeBirthDay: (val: string) => void
  gender: 'male' | 'female' | ''
  onChangeGender: (val: 'male' | 'female') => void
  onSubmit: () => void
  is_loading?: boolean
  error?: string | null
  placeholder?: string
}

export const UserInput: React.FC<UserInputProps> = ({
  prompt,
  onChangePrompt,
  birthYear,
  onChangeBirthYear,
  birthMonth,
  onChangeBirthMonth,
  birthDay,
  onChangeBirthDay,
  gender,
  onChangeGender,
  onSubmit,
  is_loading = false,
  error,
  placeholder = '예: 오늘 하루 나에게 찾아올 특별한 길운이나 주의해야 할 점은 무엇일까요? 오늘의 운세를 점쳐주세요.',
}) => {
  // 년도 목록 (현재 2026년부터 1940년까지)
  const years = useMemo(() => {
    const list: number[] = []
    for (let y = 2026; y >= 1940; y--) {
      list.push(y)
    }
    return list
  }, [])

  // 월 목록 (1~12월)
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])

  // 일 목록 (선택된 연/월에 따른 일수 동적 계산)
  const days = useMemo(() => {
    const y = parseInt(birthYear, 10)
    const m = parseInt(birthMonth, 10)
    let maxDays = 31
    if (m === 4 || m === 6 || m === 9 || m === 11) {
      maxDays = 30
    } else if (m === 2) {
      const isLeap = y ? (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 : false
      maxDays = isLeap ? 29 : 28
    }
    return Array.from({ length: maxDays }, (_, i) => i + 1)
  }, [birthYear, birthMonth])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (is_loading) return
    onSubmit()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (is_loading) return
      onSubmit()
    }
  }

  // 필드 누락 검사 시각 하이라이트
  const isBirthYearMissing = !!error && !birthYear
  const isBirthMonthMissing = !!error && !birthMonth
  const isBirthDayMissing = !!error && !birthDay
  const isGenderMissing = !!error && !gender

  return (
    <form className="fv-user-input" onSubmit={handleSubmit}>
      {/* 1. 사주/별자리 탄생 정보 입력 섹션 (생년, 월, 일, 성별) */}
      <div className="fv-birth-section">
        <div className="fv-birth-section__header">
          <span className="fv-birth-section__title">
            ✦ 의뢰인의 탄생 천체 정보 (생년월일 & 성별)
          </span>
          <span className="fv-birth-section__hint">
            * 오라클이 정확한 별자리와 음양의 기운을 짚어내기 위해 반드시 필요합니다.
          </span>
        </div>

        {/* 생년월일 3분할 셀렉트 박스 */}
        <div className="fv-birth-grid">
          {/* 생년 */}
          <div className="fv-select-wrap">
            <label className="fv-select-label">태어난 해 (년)</label>
            <select
              className={`fv-select ${isBirthYearMissing ? 'fv-select--error' : ''}`}
              value={birthYear}
              onChange={(e) => onChangeBirthYear(e.target.value)}
              disabled={is_loading}
            >
              <option value="">년도 선택</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>

          {/* 생월 */}
          <div className="fv-select-wrap">
            <label className="fv-select-label">태어난 달 (월)</label>
            <select
              className={`fv-select ${isBirthMonthMissing ? 'fv-select--error' : ''}`}
              value={birthMonth}
              onChange={(e) => onChangeBirthMonth(e.target.value)}
              disabled={is_loading}
            >
              <option value="">월 선택</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>

          {/* 생일 */}
          <div className="fv-select-wrap">
            <label className="fv-select-label">태어난 날 (일)</label>
            <select
              className={`fv-select ${isBirthDayMissing ? 'fv-select--error' : ''}`}
              value={birthDay}
              onChange={(e) => onChangeBirthDay(e.target.value)}
              disabled={is_loading}
            >
              <option value="">일 선택</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 성별 선택 토글 버튼 */}
        <div className="fv-gender-container">
          <span className="fv-gender-label">성별 (음양의 조화)</span>
          <div className={`fv-gender-buttons ${isGenderMissing ? 'fv-gender-buttons--error' : ''}`}>
            <button
              type="button"
              className={`fv-gender-btn ${gender === 'male' ? 'fv-gender-btn--active' : ''}`}
              onClick={() => onChangeGender('male')}
              disabled={is_loading}
            >
              <span>♂️</span>
              <span>남성 (양의 기운)</span>
            </button>
            <button
              type="button"
              className={`fv-gender-btn ${gender === 'female' ? 'fv-gender-btn--active' : ''}`}
              onClick={() => onChangeGender('female')}
              disabled={is_loading}
            >
              <span>♀️</span>
              <span>여성 (음의 기운)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 질문 텍스트 입력 영역 */}
      <div className="fv-user-input__field">
        <TextArea
          label="📜 양피지에 새길 당신의 질문"
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={is_loading}
          error={error || undefined}
          helperText="오늘의 고민이나 궁금한 일을 적어보세요. (Ctrl+Enter 로 즉시 봉인)"
          maxLength={300}
          showCharCount
          rows={4}
        />
      </div>

      {/* 3. 운세 보기 버튼 */}
      <div className="fv-user-input__actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={is_loading}
          isLoading={is_loading}
        >
          ✨ 운세 보기
        </Button>
      </div>
    </form>
  )
}
