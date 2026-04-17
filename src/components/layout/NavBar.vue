<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import UserMenu from './UserMenu.vue'
import {
  Menu,
  X,
  Package,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const mobileMenuOpen = ref(false)

// QuestionDetail 页面使用左对齐布局
const isLeftAligned = computed(() => route.name === 'QuestionDetail')

function navigateTo(path: string) {
  router.push(path)
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="nav-bar" :class="{ 'left-aligned': isLeftAligned }">
    <div class="nav-inner" :class="{ 'left-aligned': isLeftAligned }">
      <!-- 左侧：Logo + 导航 -->
      <div class="nav-left">
        <div class="nav-logo-wrap" @click="navigateTo('/')">
          <img class="nav-logo" src="/logo.png" alt="logo" />
          <span class="nav-brand">Human Hub</span>
        </div>
        <div class="nav-links">
          <button
            class="nav-link"
            :class="{ active: route.path === '/' || route.name === 'Home' }"
            @click="navigateTo('/')"
          >Home</button>
          <button
            class="nav-link"
            :class="{ active: route.path === '/skills' || route.name === 'Skills' }"
            @click="navigateTo('/skills')"
          >Skills</button>
          <button
            class="nav-link"
            :class="{ active: route.path === '/graph' }"
            @click="navigateTo('/graph')"
          >Graph</button>
          <button
            class="nav-link"
            :class="{ active: route.path === '/stars' || route.name === 'MyStars' }"
            @click="navigateTo('/stars')"
          >Stars</button>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="nav-right">

        <!-- 未登录 -->
        <template v-if="!auth.isLoggedIn && !auth.loading">
          <button class="login-btn" @click="auth.loginWithGitHub()">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Sign in
          </button>
        </template>

        <!-- 已登录 -->
        <template v-else-if="auth.isLoggedIn">
          <button
            class="box-btn"
            :class="{ active: route.path === '/box' }"
            @click="navigateTo('/box')"
            title="我的盒子"
          >
            <Package :size="16" />
          </button>
          <UserMenu />
        </template>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-toggle md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
          <component :is="mobileMenuOpen ? X : Menu" :size="18" />
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="mobile-menu md:hidden">
        <button
          class="mobile-link"
          :class="{ active: route.path === '/' }"
          @click="navigateTo('/')"
        >Home</button>
        <button
          class="mobile-link"
          :class="{ active: route.path === '/skills' }"
          @click="navigateTo('/skills')"
        >Skills</button>
        <button
          class="mobile-link"
          :class="{ active: route.path === '/graph' }"
          @click="navigateTo('/graph')"
        >Graph</button>
        <button
          class="mobile-link"
          :class="{ active: route.path === '/stars' }"
          @click="navigateTo('/stars')"
        >Stars</button>

        <template v-if="!auth.isLoggedIn">
          <div class="mobile-divider"></div>
          <button class="mobile-link" @click="auth.loginWithGitHub(); mobileMenuOpen = false">
            Sign in with GitHub
          </button>
        </template>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.nav-bar {
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #f0f0f0;
}

.nav-inner {
  max-width: 900px;
  margin: 0 auto;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

/* QuestionDetail 页面左对齐模式 */
.nav-inner.left-aligned {
  max-width: none;
  margin: 0;
  padding: 0 24px;
}

/* 左侧：Logo + 导航 */
.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.nav-logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.nav-logo {
  height: 28px;
  width: auto;
  flex-shrink: 0;
  object-fit: contain;
}

.nav-brand {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.3px;
  white-space: nowrap;
  color: #111827;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* 右侧 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.nav-link {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.nav-link:hover {
  color: #111827;
  background: #f5f5f5;
}

.nav-link.active {
  color: #111827;
  font-weight: 600;
}

.nav-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.login-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.box-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.box-btn:hover {
  background: #f5f5f5;
  color: #111827;
}

.box-btn.active {
  color: #111827;
  background: #f0f0f0;
}

.mobile-toggle {
  padding: 6px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.mobile-toggle:hover {
  background: #f5f5f5;
  color: #111827;
}

/* 移动端下拉菜单 */
.mobile-menu {
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-link {
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}

.mobile-link:hover, .mobile-link.active {
  color: #111827;
  background: #f5f5f5;
}

.mobile-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0;
}

/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
