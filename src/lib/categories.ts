/**
 * 类别配置 - 技能类别映射和颜色配置
 */

// 类别类型
export type SkillCategory = 'knowledge' | 'experience' | 'tool'

// 类别映射：key -> 中文显示
export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  knowledge: '知识通识',
  experience: '经验技巧',
  tool: '产品工具',
}

// 类别颜色配置
export interface CategoryColorConfig {
  bg: string      // 背景色
  text: string    // 文字色
  border: string  // 边框色
}

// 类别颜色映射
export const CATEGORY_COLORS: Record<SkillCategory, CategoryColorConfig> = {
  knowledge: {
    bg: '#dbeafe',      // blue-100
    text: '#1e40af',    // blue-800
    border: '#93c5fd',  // blue-300
  },
  experience: {
    bg: '#dcfce7',      // green-100
    text: '#166534',    // green-800
    border: '#86efac',  // green-300
  },
  tool: {
    bg: '#ffedd5',      // orange-100
    text: '#9a3412',    // orange-800
    border: '#fdba74',  // orange-300
  },
}

// 所有类别 key 列表
export const ALL_CATEGORIES: SkillCategory[] = ['knowledge', 'experience', 'tool']

// 类别配置列表（用于遍历）
export const CATEGORIES: { value: SkillCategory; label: string; color: string }[] = [
  { value: 'knowledge', label: '知识通识', color: '#3b82f6' },
  { value: 'experience', label: '经验技巧', color: '#22c55e' },
  { value: 'tool', label: '产品工具', color: '#f97316' },
]

/**
 * 获取类别的中文显示名
 */
export function getCategoryLabel(key: SkillCategory): string {
  return CATEGORY_LABELS[key]
}

/**
 * 获取类别的颜色配置
 */
export function getCategoryColors(key: SkillCategory): CategoryColorConfig {
  return CATEGORY_COLORS[key]
}

/**
 * 验证类别 key 是否有效
 */
export function isValidCategory(key: string): key is SkillCategory {
  return ALL_CATEGORIES.includes(key as SkillCategory)
}
