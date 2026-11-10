import { useState, useCallback } from 'react'
import { requestFortuneFromGemini, GeminiFortuneOptions, UserBirthInfo } from '@/shared/API'

export interface UseFortuneAIReturn {
  result: string | null
  is_loading: boolean
  error: string | null
  fetchFortune: (
    prompt: string,
    birthInfo?: UserBirthInfo,
    options?: GeminiFortuneOptions,
  ) => Promise<string | null>
  resetFortune: () => void
}

/**
 * Gemini API를 호출하여 운세를 점치고,
 * is_loading, error, result 상태를 관리하는 커스텀 훅
 */
export const useFortuneAI = (): UseFortuneAIReturn => {
  const [result, setResult] = useState<string | null>(null)
  const [is_loading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFortune = useCallback(
    async (
      prompt: string,
      birthInfo?: UserBirthInfo,
      options?: GeminiFortuneOptions,
    ): Promise<string | null> => {
      // 1. 생년월일 및 성별 입력 검증
      if (birthInfo) {
        if (!birthInfo.birthYear || !birthInfo.birthMonth || !birthInfo.birthDay) {
          const errorMsg = '📜 탄생의 별자리를 읽기 위해 생년, 월, 일을 모두 선택해 주세요!'
          setError(errorMsg)
          return null
        }
        if (!birthInfo.gender) {
          const errorMsg = '📜 음양의 조화를 살피기 위해 성별을 선택해 주세요!'
          setError(errorMsg)
          return null
        }
      }

      // 2. 질문 입력 검증
      if (!prompt.trim()) {
        const errorMsg = '📜 양피지에 마음속 질문을 먼저 적어주셔야 운세를 점칠 수 있습니다.'
        setError(errorMsg)
        return null
      }

      setIsLoading(true)
      setError(null)
      setResult(null)

      try {
        const answer = await requestFortuneFromGemini(prompt.trim(), {
          birthInfo,
          ...options,
        })
        setResult(answer)
        return answer
      } catch (err: any) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : '운세를 점치는 도중 알 수 없는 마법의 왜곡이 발생했습니다.'
        setError(errorMsg)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const resetFortune = useCallback(() => {
    setResult(null)
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    result,
    is_loading,
    error,
    fetchFortune,
    resetFortune,
  }
}
