export interface Skill {
  id: string
  name: string
  version: string
  summary: string
  description: string       // 使用说明 (Markdown)
  caseExample: string        // 案例说明 (Markdown)
  authorId: string
  authorName: string
  authorAvatar: string | null
  starsCount: number
  commentsCount: number
  createdAt: string
  updatedAt: string
  tags?: string[]            // 标签数组 (英文 key)
}

export interface Star {
  id: string
  userId: string
  skillId: string
  createdAt: string
}

export interface Comment {
  id: string
  skillId: string
  userId: string
  userName: string
  userAvatar: string | null
  content: string
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatarUrl: string | null
}

// 表单数据（发布/编辑用）
export interface SkillForm {
  name: string
  version: string
  summary: string
  description: string
  caseExample: string
}

// 排序选项
export type SortBy = 'stars' | 'newest' | 'updated' | 'name'
