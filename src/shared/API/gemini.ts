/**
 * Gemini API 클라이언트 모듈 (shared/API)
 * Google Gemini REST API를 사용하여 신비로운 오라클 운세를 생성합니다.
 */

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

// 최신 활성 Free Tier 모델 목록 (우선순위 순서)
const SUPPORTED_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
]

export interface UserBirthInfo {
  birthYear: string
  birthMonth: string
  birthDay: string
  gender: 'male' | 'female' | ''
}

export interface GeminiFortuneOptions {
  model?: string
  temperature?: number
  birthInfo?: UserBirthInfo
}

/**
 * 환경 변수에서 Gemini API 키를 가져오고 유효성을 검사합니다.
 */
export const getGeminiApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('{여기에')) {
    throw new Error(
      'Gemini API 키가 설정되지 않았습니다. 프로젝트 루트의 .env 파일에 올바른 VITE_GEMINI_API_KEY 값을 입력해 주세요.',
    )
  }

  return apiKey.trim()
}

/**
 * 대마법사의 서재 오라클 콘셉트를 위한 시스템 인스트럭션
 */
const ORACLE_SYSTEM_INSTRUCTION = `
당신은 자욱한 안개와 은은한 촛불이 맴도는 서재에 기거하는 고대 비전서의 수호자이자 대마법사 오라클(Oracle)입니다.
사용자가 건넨 생년월일(사주/탄생 천체 및 별자리의 기운), 성별, 그리고 마음속 질문의 파동을 읽어 오늘의 운명과 길운의 흐름을 점쳐주세요.

[답변 작성 가이드라인]
1. 말투는 고풍스러우면서도 신비롭고, 따뜻한 통찰과 용기를 주는 지혜로운 마법사의 어조를 사용하세요.
2. 질문자의 생년월일과 성별이 주어진 경우, 타고난 천체의 별자리와 음양오행의 기운을 서재의 비전서와 엮어 흥미진진하게 인용하세요.
3. 아래와 같은 체계적인 마법서 형식으로 나누어 작성하세요:
   📜 [오라클의 예언 총평] : 의뢰인의 탄생 천체 기운과 오늘 하루 운명의 흐름
   🕯️ [서재의 촛불이 밝히는 조언] : 마음가짐이나 오늘 취하면 좋을 행동 지침
   ✨ [오늘의 수호 아뮬렛] : 길운을 부르는 상징물, 행운의 색상, 행운의 숫자
4. 가독성을 위해 문단 사이에 적절히 줄바꿈을 넣고, 품격 있고 매력적으로 답변하세요.
5. 한국어로 작성하세요.
`.trim()

/**
 * 사용자 프롬프트와 생년월일 정보를 바탕으로 Gemini API를 호출하여 운세 답변을 생성합니다.
 */
export const requestFortuneFromGemini = async (
  prompt: string,
  options: GeminiFortuneOptions = {},
): Promise<string> => {
  const apiKey = getGeminiApiKey()
  const candidateModels = options.model ? [options.model] : SUPPORTED_MODELS
  const temperature = options.temperature ?? 0.85
  const birthInfo = options.birthInfo

  // 생년월일 및 성별 정보 텍스트 포맷팅
  let userContextText = ''
  if (birthInfo && birthInfo.birthYear && birthInfo.birthMonth && birthInfo.birthDay && birthInfo.gender) {
    const genderKorean = birthInfo.gender === 'male' ? '남성' : '여성'
    userContextText = `[의뢰인 탄생 정보]\n- 생년월일: ${birthInfo.birthYear}년 ${birthInfo.birthMonth}월 ${birthInfo.birthDay}일생\n- 성별: ${genderKorean}\n\n`
  }

  const promptBody = `${userContextText}마법사님, 오늘 제 운명에 대해 다음 질문을 올립니다:\n"${prompt}"`

  let lastError: Error | null = null

  // 지원 모델을 순차 시도하여 가장 안정적인 응답 획득
  for (const model of candidateModels) {
    const url = `${GEMINI_API_BASE_URL}/${model}:generateContent?key=${apiKey}`

    const requestPayload = {
      system_instruction: {
        parts: [
          {
            text: ORACLE_SYSTEM_INSTRUCTION,
          },
        ],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptBody,
            },
          ],
        },
      ],
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const serverMessage = errorData?.error?.message || response.statusText

        if (response.status === 404) {
          lastError = new Error(`모델 ${model}을(를) 찾을 수 없습니다: ${serverMessage}`)
          continue
        } else if (response.status === 403 || response.status === 401) {
          throw new Error('Gemini API 키가 유효하지 않거나 권한이 없습니다. API 키를 다시 확인해 주세요.')
        } else if (response.status === 429) {
          lastError = new Error('단시간에 너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.')
          continue
        } else {
          lastError = new Error(`Gemini API 오류 (${response.status}): ${serverMessage}`)
          continue
        }
      }

      const data = await response.json()
      const textResult = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (!textResult) {
        lastError = new Error('오라클의 응답을 해석할 수 없습니다.')
        continue
      }

      return textResult.trim()
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('네트워크 연결에 실패했습니다. 인터넷 연결 상태를 확인해 주세요.')
      }
      lastError = error
    }
  }

  throw lastError || new Error('오라클 신탁을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
}
