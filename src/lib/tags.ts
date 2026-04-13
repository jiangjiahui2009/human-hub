/**
 * 标签配置 - 标签映射和颜色配置
 */

// 标签英文 key 类型
export type TagKey =
  | 'generate_ideas'
  | 'optimize_expression'
  | 'reduce_rework'
  | 'unlock_agent'
  | 'token_usage'
  | 'multi_agent'
  | 'production'
  | 'bug_fix'

// 所有标签 key 列表
export const ALL_TAG_KEYS: TagKey[] = [
  'generate_ideas',
  'optimize_expression',
  'reduce_rework',
  'unlock_agent',
  'token_usage',
  'multi_agent',
  'production',
  'bug_fix',
]

// 标签映射：英文 key -> 中文显示
export const TAG_LABELS: Record<TagKey, string> = {
  generate_ideas: '产生点子',
  optimize_expression: '优化表达',
  reduce_rework: '减少返工',
  unlock_agent: '激发Agent能力',
  token_usage: 'Token消耗',
  multi_agent: '多Agent',
  production: '生产环境',
  bug_fix: 'bug修复',
}

// 标签颜色配置
export interface TagColorConfig {
  bg: string      // 背景色
  text: string    // 文字色
  border: string  // 边框色
}

// 标签颜色映射
export const TAG_COLORS: Record<TagKey, TagColorConfig> = {
  generate_ideas: {
    bg: '#dbeafe',      // blue-100
    text: '#1e40af',    // blue-800
    border: '#93c5fd',  // blue-300
  },
  optimize_expression: {
    bg: '#dcfce7',      // green-100
    text: '#166534',    // green-800
    border: '#86efac',  // green-300
  },
  reduce_rework: {
    bg: '#ffedd5',      // orange-100
    text: '#9a3412',    // orange-800
    border: '#fdba74',  // orange-300
  },
  unlock_agent: {
    bg: '#f3e8ff',      // purple-100
    text: '#6b21a8',    // purple-800
    border: '#d8b4fe',  // purple-300
  },
  token_usage: {
    bg: '#fee2e2',      // red-100
    text: '#991b1b',    // red-800
    border: '#fca5a5',  // red-300
  },
  multi_agent: {
    bg: '#cffafe',      // cyan-100
    text: '#155e75',    // cyan-800
    border: '#67e8f9',  // cyan-300
  },
  production: {
    bg: '#f3f4f6',      // gray-100
    text: '#374151',    // gray-700
    border: '#d1d5db',  // gray-300
  },
  bug_fix: {
    bg: '#fce7f3',      // pink-100
    text: '#9d174d',    // pink-800
    border: '#f9a8d4',  // pink-300
  },
}

/**
 * 获取标签的中文显示名
 */
export function getTagLabel(key: TagKey): string {
  return TAG_LABELS[key]
}

/**
 * 获取标签的颜色配置
 */
export function getTagColors(key: TagKey): TagColorConfig {
  return TAG_COLORS[key]
}

/**
 * 验证标签 key 是否有效
 */
export function isValidTagKey(key: string): key is TagKey {
  return ALL_TAG_KEYS.includes(key as TagKey)
}
