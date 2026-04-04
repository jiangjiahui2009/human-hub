import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Skill, Comment, SortBy } from '../types'
import {
  loadMockSkills,
  saveMockSkills,
  loadMockComments,
  saveMockComments,
  loadMyStars,
  saveMyStars,
} from '../lib/mock-data'

// 是否使用 Mock 数据（由环境变量或 .env 控制）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const useSkillsStore = defineStore('skills', () => {
  const skills = ref<Skill[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const sortBy = ref<SortBy>('stars')
  const pageSize = ref(6)
  const displayedCount = ref(6)

  // 当前用户 starred 的 skill ID 集合
  const myStarredIds = ref<Set<string>>(new Set())

  // 过滤 + 排序后的列表
  const filteredSkills = computed(() => {
    let result = [...skills.value]

    // 搜索过滤
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(
        s => s.name.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
      )
    }

    // 排序
    switch (sortBy.value) {
      case 'stars':
        result.sort((a, b) => b.starsCount - a.starsCount)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'updated':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  })

  // 当前显示的列表（分页）
  const visibleSkills = computed(() => {
    return filteredSkills.value.slice(0, displayedCount.value)
  })

  // 是否还有更多
  const hasMore = computed(() => {
    return displayedCount.value < filteredSkills.value.length
  })

  function loadMore() {
    displayedCount.value += pageSize.value
  }

  // 搜索/排序变化时重置分页
  watch([searchQuery, sortBy], () => {
    displayedCount.value = pageSize.value
  })

  // ==================== Mock 实现 ====================

  function mockFetchSkills() {
    skills.value = loadMockSkills()
    myStarredIds.value = loadMyStars()
  }

  function mockFetchSkill(id: string): Skill | null {
    return skills.value.find(s => s.id === id) || null
  }

  function mockCreateSkill(
    form: { name: string; version: string; summary: string; description: string; caseExample: string },
    authorId: string,
    authorName: string,
    authorAvatar: string | null
  ): Skill {
    const now = new Date().toISOString()
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: form.name,
      version: form.version,
      summary: form.summary,
      description: form.description,
      caseExample: form.caseExample,
      authorId,
      authorName,
      authorAvatar,
      starsCount: 0,
      commentsCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    skills.value.unshift(newSkill)
    saveMockSkills(skills.value)
    return newSkill
  }

  function mockUpdateSkill(id: string, updates: Partial<{ name: string; version: string; summary: string; description: string; caseExample: string }>): boolean {
    const idx = skills.value.findIndex(s => s.id === id)
    if (idx < 0) return false
    Object.assign(skills.value[idx], updates, { updatedAt: new Date().toISOString() })
    saveMockSkills(skills.value)
    return true
  }

  function mockDeleteSkill(id: string): boolean {
    skills.value = skills.value.filter(s => s.id !== id)
    saveMockSkills(skills.value)
    return true
  }

  function mockToggleStar(skillId: string): boolean {
    const isStarred = myStarredIds.value.has(skillId)
    if (isStarred) {
      myStarredIds.value.delete(skillId)
    } else {
      myStarredIds.value.add(skillId)
    }
    saveMyStars(myStarredIds.value)

    const skill = skills.value.find(s => s.id === skillId)
    if (skill) {
      skill.starsCount += isStarred ? -1 : 1
      saveMockSkills(skills.value)
    }

    return !isStarred
  }

  function mockFetchMyStars(): string[] {
    myStarredIds.value = loadMyStars()
    return [...myStarredIds.value]
  }

  function mockFetchStarredSkills(): Skill[] {
    const ids = mockFetchMyStars()
    return skills.value.filter(s => ids.includes(s.id))
  }

  function mockFetchComments(skillId: string): Comment[] {
    const allComments = loadMockComments()
    return allComments.filter(c => c.skillId === skillId)
  }

  function mockAddComment(skillId: string, userId: string, userName: string, userAvatar: string | null, content: string): Comment {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      skillId,
      userId,
      userName,
      userAvatar,
      content,
      createdAt: new Date().toISOString(),
    }
    const allComments = loadMockComments()
    allComments.push(newComment)
    saveMockComments(allComments)

    const skill = skills.value.find(s => s.id === skillId)
    if (skill) {
      skill.commentsCount += 1
      saveMockSkills(skills.value)
    }

    return newComment
  }

  function mockDeleteComment(commentId: string, skillId: string): boolean {
    let allComments = loadMockComments()
    allComments = allComments.filter(c => c.id !== commentId)
    saveMockComments(allComments)

    const skill = skills.value.find(s => s.id === skillId)
    if (skill) {
      skill.commentsCount = Math.max(0, skill.commentsCount - 1)
      saveMockSkills(skills.value)
    }

    return true
  }

  // ==================== Supabase 实现（保留，切换时启用）====================

  async function sbFetchSkills() {
    loading.value = true
    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      skills.value = (data || []).map(rowToSkill)
    } catch (e) {
      console.error('加载技能失败:', e)
    } finally {
      loading.value = false
    }
  }

  async function sbFetchSkill(id: string): Promise<Skill | null> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('id', id)
        .single()

      if (error) return null
      return rowToSkill(data)
    } catch (e) {
      console.error('加载技能失败:', e)
      return null
    }
  }

  async function sbCreateSkill(form: { name: string; version: string; summary: string; description: string; caseExample: string }, authorId: string, authorName: string, authorAvatar: string | null): Promise<Skill | null> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('skills')
        .insert({
          name: form.name,
          version: form.version,
          summary: form.summary,
          description: form.description,
          case_example: form.caseExample,
          author_id: authorId,
          author_name: authorName,
          author_avatar: authorAvatar,
        })
        .select()
        .single()

      if (error) throw error
      const newSkill = rowToSkill(data)
      skills.value.unshift(newSkill)
      return newSkill
    } catch (e) {
      console.error('创建技能失败:', e)
      return null
    }
  }

  async function sbUpdateSkill(id: string, updates: Partial<{ name: string; version: string; summary: string; description: string; caseExample: string }>): Promise<boolean> {
    try {
      const { supabase } = await import('../lib/supabase')
      const dbUpdates: any = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.version !== undefined) dbUpdates.version = updates.version
      if (updates.summary !== undefined) dbUpdates.summary = updates.summary
      if (updates.description !== undefined) dbUpdates.description = updates.description
      if (updates.caseExample !== undefined) dbUpdates.case_example = updates.caseExample
      dbUpdates.updated_at = new Date().toISOString()

      const { error } = await supabase
        .from('skills')
        .update(dbUpdates)
        .eq('id', id)

      if (error) throw error

      const idx = skills.value.findIndex(s => s.id === id)
      if (idx >= 0) {
        Object.assign(skills.value[idx], updates, { updatedAt: dbUpdates.updated_at })
      }
      return true
    } catch (e) {
      console.error('更新技能失败:', e)
      return false
    }
  }

  async function sbDeleteSkill(id: string): Promise<boolean> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      skills.value = skills.value.filter(s => s.id !== id)
      return true
    } catch (e) {
      console.error('删除技能失败:', e)
      return false
    }
  }

  async function sbToggleStar(skillId: string, userId: string): Promise<boolean> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase.rpc('toggle_star', {
        p_user_id: userId,
        p_skill_id: skillId,
      })
      if (error) throw error

      const isStarred = myStarredIds.value.has(skillId)
      if (isStarred) {
        myStarredIds.value.delete(skillId)
      } else {
        myStarredIds.value.add(skillId)
      }

      const skill = skills.value.find(s => s.id === skillId)
      if (skill) {
        skill.starsCount += isStarred ? -1 : 1
      }

      return !isStarred
    } catch (e) {
      console.error('Toggle star 失败:', e)
      return myStarredIds.value.has(skillId)
    }
  }

  async function sbFetchMyStars(userId: string): Promise<string[]> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('stars')
        .select('skill_id')
        .eq('user_id', userId)

      if (error) throw error
      const ids = (data || []).map(r => r.skill_id as string)
      myStarredIds.value = new Set(ids)
      return ids
    } catch (e) {
      console.error('加载收藏列表失败:', e)
      return []
    }
  }

  async function sbFetchStarredSkills(userId: string): Promise<Skill[]> {
    const starIds = await sbFetchMyStars(userId)
    if (starIds.length === 0) return []

    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .in('id', starIds)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).map(rowToSkill)
    } catch (e) {
      console.error('加载收藏技能失败:', e)
      return []
    }
  }

  async function sbFetchComments(skillId: string): Promise<Comment[]> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('skill_id', skillId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data || []).map(rowToComment)
    } catch (e) {
      console.error('加载评论失败:', e)
      return []
    }
  }

  async function sbAddComment(skillId: string, userId: string, userName: string, userAvatar: string | null, content: string): Promise<Comment | null> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('comments')
        .insert({
          skill_id: skillId,
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          content,
        })
        .select()
        .single()

      if (error) throw error

      const skill = skills.value.find(s => s.id === skillId)
      if (skill) {
        skill.commentsCount += 1
      }

      return rowToComment(data)
    } catch (e) {
      console.error('发表评论失败:', e)
      return null
    }
  }

  async function sbDeleteComment(commentId: string, skillId: string): Promise<boolean> {
    try {
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase.from('comments').delete().eq('id', commentId)
      if (error) throw error

      const skill = skills.value.find(s => s.id === skillId)
      if (skill) {
        skill.commentsCount = Math.max(0, skill.commentsCount - 1)
      }
      return true
    } catch (e) {
      console.error('删除评论失败:', e)
      return false
    }
  }

  // ===== 统一接口（根据模式自动选择实现）=====

  async function fetchSkills() {
    if (USE_MOCK) {
      mockFetchSkills()
    } else {
      await sbFetchSkills()
    }
  }

  async function fetchSkill(id: string): Promise<Skill | null> {
    if (USE_MOCK) {
      return mockFetchSkill(id)
    } else {
      return sbFetchSkill(id)
    }
  }

  async function createSkill(form: { name: string; version: string; summary: string; description: string; caseExample: string }, authorId: string, authorName: string, authorAvatar: string | null): Promise<Skill | null> {
    if (USE_MOCK) {
      return mockCreateSkill(form, authorId, authorName, authorAvatar)
    } else {
      return sbCreateSkill(form, authorId, authorName, authorAvatar)
    }
  }

  async function updateSkill(id: string, updates: Partial<{ name: string; version: string; summary: string; description: string; caseExample: string }>): Promise<boolean> {
    if (USE_MOCK) {
      return mockUpdateSkill(id, updates)
    } else {
      return sbUpdateSkill(id, updates)
    }
  }

  async function deleteSkill(id: string): Promise<boolean> {
    if (USE_MOCK) {
      return mockDeleteSkill(id)
    } else {
      return sbDeleteSkill(id)
    }
  }

  async function toggleStar(skillId: string, _userId?: string): Promise<boolean> {
    if (USE_MOCK) {
      return mockToggleStar(skillId)
    } else {
      return sbToggleStar(skillId, _userId || '')
    }
  }

  async function fetchMyStars(userId?: string): Promise<string[]> {
    if (USE_MOCK) {
      return mockFetchMyStars()
    } else {
      return sbFetchMyStars(userId || '')
    }
  }

  async function fetchStarredSkills(userId?: string): Promise<Skill[]> {
    if (USE_MOCK) {
      return mockFetchStarredSkills()
    } else {
      return sbFetchStarredSkills(userId || '')
    }
  }

  async function fetchComments(skillId: string): Promise<Comment[]> {
    if (USE_MOCK) {
      return mockFetchComments(skillId)
    } else {
      return sbFetchComments(skillId)
    }
  }

  async function addComment(skillId: string, userId: string, userName: string, userAvatar: string | null, content: string): Promise<Comment | null> {
    if (USE_MOCK) {
      return mockAddComment(skillId, userId, userName, userAvatar, content)
    } else {
      return sbAddComment(skillId, userId, userName, userAvatar, content)
    }
  }

  async function deleteComment(commentId: string, skillId: string): Promise<boolean> {
    if (USE_MOCK) {
      return mockDeleteComment(commentId, skillId)
    } else {
      return sbDeleteComment(commentId, skillId)
    }
  }

  // ===== 工具函数：数据库行 → 前端对象（仅 Supabase 模式使用）=====

  function rowToSkill(row: any): Skill {
    return {
      id: row.id,
      name: row.name,
      version: row.version,
      summary: row.summary,
      description: row.description || '',
      caseExample: row.case_example || '',
      authorId: row.author_id,
      authorName: row.author_name,
      authorAvatar: row.author_avatar,
      starsCount: row.stars_count || 0,
      commentsCount: row.comments_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  function rowToComment(row: any): Comment {
    return {
      id: row.id,
      skillId: row.skill_id,
      userId: row.user_id,
      userName: row.user_name,
      userAvatar: row.user_avatar,
      content: row.content,
      createdAt: row.created_at,
    }
  }

  return {
    skills,
    loading,
    searchQuery,
    sortBy,
    filteredSkills,
    visibleSkills,
    hasMore,
    loadMore,
    myStarredIds,
    fetchSkills,
    fetchSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    toggleStar,
    fetchMyStars,
    fetchStarredSkills,
    fetchComments,
    addComment,
    deleteComment,
  }
})
