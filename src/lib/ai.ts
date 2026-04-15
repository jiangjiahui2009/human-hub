/**
 * AI 服务模块 - 封装 DeepSeek API 调用
 */

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export interface GenerateSummaryOptions {
  maxLength?: number
  minLength?: number
}

/**
 * 调用 DeepSeek API 生成技能摘要
 * @param description 技能使用说明
 * @param options 配置选项
 * @returns 生成的摘要
 */
export async function generateSummary(
  description: string,
  options: GenerateSummaryOptions = {}
): Promise<string> {
  const { maxLength = 100, minLength = 30 } = options

  if (!DEEPSEEK_API_KEY) {
    console.warn('DeepSeek API Key 未配置，返回空摘要')
    return ''
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的技能描述摘要生成助手。请根据用户提供的技能说明，生成简洁、准确的摘要。',
          },
          {
            role: 'user',
            content: `请根据以下技能说明，生成一个 ${minLength}-${maxLength} 字的摘要，突出核心功能和使用场景：

${description}

要求：
1. 简洁明了，突出核心价值
2. 不要包含"该技能"、"本技能"等冗余词汇
3. 直接描述功能，如"自动生成代码注释，支持多种语言"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('DeepSeek API 错误:', errorData)
      return ''
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      console.warn('DeepSeek 返回空摘要')
      return ''
    }

    return summary
  } catch (error) {
    console.error('调用 DeepSeek API 失败:', error)
    return ''
  }
}

/**
 * 检查 AI 服务是否可用
 */
export function isAIServiceAvailable(): boolean {
  return !!DEEPSEEK_API_KEY
}
