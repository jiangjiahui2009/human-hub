import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '../types'
import { MOCK_CURRENT_USER } from '../lib/mock-data'

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)

  // ==================== Mock 实现 ====================

  function mockInit() {
    // 检查是否有模拟的登录状态（用 sessionStorage 记录）
    const saved = sessionStorage.getItem('mock-user')
    if (saved) {
      user.value = JSON.parse(saved)
    }
    loading.value = false
  }

  function mockLoginWithGitHub() {
    user.value = {
      id: MOCK_CURRENT_USER.id,
      email: MOCK_CURRENT_USER.email,
      name: MOCK_CURRENT_USER.user_metadata.full_name,
      avatarUrl: MOCK_CURRENT_USER.user_metadata.avatar_url,
    }
    sessionStorage.setItem('mock-user', JSON.stringify(user.value))
  }

  function mockLogout() {
    user.value = null
    sessionStorage.removeItem('mock-user')
  }

  // ==================== Supabase 实现（保留）====================

  async function sbInit() {
    try {
      const { supabase } = await import('../lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setFromSession(session.user)
      }
      loading.value = false

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setFromSession(session.user)
        } else {
          user.value = null
          sessionStorage.removeItem('sb-user')
        }
        loading.value = false
      })
    } catch {
      loading.value = false
    }
  }

  async function sbLoginWithGitHub() {
    const { supabase } = await import('../lib/supabase')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  async function sbLogout() {
    const { supabase } = await import('../lib/supabase')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    sessionStorage.removeItem('sb-user')
  }

  // ===== 工具函数 =====

  function setFromSession(u: any) {
    const meta = u.user_metadata || {}
    user.value = {
      id: u.id,
      email: u.email || '',
      name: meta.preferred_username || meta.user_name || meta.name || u.email?.split('@')[0] || 'User',
      avatarUrl: meta.avatar_url || meta.picture || null,
    }
    sessionStorage.setItem('sb-user', JSON.stringify(user.value))
  }

  // ===== 统一接口 =====

  async function init() {
    if (USE_MOCK) {
      mockInit()
    } else {
      await sbInit()
    }
  }

  async function loginWithGitHub() {
    if (USE_MOCK) {
      mockLoginWithGitHub()
    } else {
      await sbLoginWithGitHub()
    }
  }

  async function logout() {
    if (USE_MOCK) {
      mockLogout()
    } else {
      await sbLogout()
    }
  }

  return {
    user,
    loading,
    isLoggedIn,
    init,
    loginWithGitHub,
    logout,
  }
})
