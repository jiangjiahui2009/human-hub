<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { LogOut, PlusCircle, Star as StarIcon, Github } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

async function handleLogout() {
  await auth.logout()
  close()
  router.push('/')
}

function goTo(path: string) {
  close()
  router.push(path)
}

// 点击外部关闭
// （由父组件处理点击外部事件）
defineExpose({ close })
</script>

<template>
  <div class="user-menu-wrap">
    <button class="avatar-btn" @click.stop="toggle">
      <img
        v-if="auth.user?.avatarUrl"
        :src="auth.user.avatarUrl"
        :alt="auth.user?.name"
        class="avatar-img"
      />
      <div v-else class="avatar-placeholder">
        {{ auth.user?.name?.charAt(0)?.toUpperCase() || '?' }}
      </div>
      <span class="user-name">{{ auth.user?.name }}</span>
      <svg class="chevron" :class="{ rotated: open }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <transition name="fade">
      <div v-if="open" class="dropdown">
        <!-- 用户信息头 -->
        <div class="dropdown-header">
          <img
            v-if="auth.user?.avatarUrl"
            :src="auth.user.avatarUrl"
            class="header-avatar"
            alt=""
          />
          <div v-else class="header-avatar-placeholder">{{ auth.user?.name?.charAt(0)?.toUpperCase() }}</div>
          <div class="header-info">
            <div class="header-name">{{ auth.user?.name }}</div>
            <div class="header-email">{{ auth.user?.email }}</div>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <!-- 菜单项 -->
        <button class="dropdown-item" @click="goTo('/stars')">
          <StarIcon :size="16" />
          我的收藏
        </button>
        <button class="dropdown-item highlight" @click="goTo('/publish')">
          <PlusCircle :size="16" />
          发布 Skill
        </button>

        <div class="dropdown-divider"></div>

        <a
          v-if="auth.user"
          :href="`https://github.com/${auth.user.name}`"
          target="_blank"
          rel="noopener noreferrer"
          class="dropdown-item external"
        >
          <Github :size="16" />
          GitHub 主页
        </a>

        <div class="dropdown-divider"></div>

        <button class="dropdown-item danger" @click="handleLogout">
          <LogOut :size="16" />
          退出登录
        </button>
      </div>
    </transition>

    <!-- 点击外部关闭遮罩 -->
    <div v-if="open" class="menu-backdrop" @click="close" />
  </div>
</template>

<style scoped>
.user-menu-wrap {
  position: relative;
}

.avatar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.avatar-btn:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.18);
}

.avatar-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: #e5e7eb;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron {
  color: #6b7280;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.chevron.rotated {
  transform: rotate(180deg);
}

/* 下拉面板 */
.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 220px;
  background: #1f2937;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  overflow: hidden;
  z-index: 100;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 10px;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.header-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}

.header-info {
  min-width: 0;
}
.header-name {
  font-size: 13px;
  font-weight: 600;
  color: #f3f4f6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-email {
  font-size: 11px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 14px;
  font-size: 13px;
  color: #d1d5db;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.12s;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(255,255,255,0.06);
  color: #f3f4f6;
}
.dropdown-item.highlight {
  color: var(--color-star, #f59e0b);
}
.dropdown-item.highlight:hover {
  background: rgba(245, 158, 11, 0.1);
}
.dropdown-item.danger {
  color: #ef4444;
}
.dropdown-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}
.dropdown-item.external {
  color: #9ca3af;
}
.dropdown-item.external:hover {
  color: #d1d5db;
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
