<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSkillsStore } from '../stores/skills'
import StarCard from '../components/skill/StarCard.vue'
import Toast from '../components/common/Toast.vue'
import { Inbox } from 'lucide-vue-next'

const auth = useAuthStore()
const store = useSkillsStore()

const doneSkills = ref<any[]>([])
const loading = ref(true)
const toastMsg = ref('')

onMounted(async () => {
  if (!auth.isLoggedIn) return
  loading.value = true
  doneSkills.value = await store.fetchDoneSkills(auth.user!.id)
  loading.value = false
})

async function handleRestore(skillId: string) {
  if (!auth.isLoggedIn || !auth.user) return
  const newDone = await store.toggleDone(skillId, auth.user.id)
  if (!newDone) {
    doneSkills.value = doneSkills.value.filter(s => s.id !== skillId)
    toastMsg.value = '已恢复到技能列表'
    setTimeout(() => { toastMsg.value = '' }, 2000)
  }
}

function handleLogin() {
  auth.loginWithGitHub()
}
</script>

<template>
  <div class="page-container">
    <Toast :message="toastMsg" />

    <!-- 未登录引导 -->
    <div v-if="!auth.isLoggedIn && !auth.loading" class="auth-prompt">
      <Inbox :size="40" class="prompt-icon" />
      <h2>登录后查看你的盒子</h2>
      <p>已掌握的技能会收纳在这里</p>
      <button class="login-btn" @click="handleLogin">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub 登录
      </button>
    </div>

    <!-- 已登录：加载中 -->
    <div v-else-if="loading" class="loading-grid">
      <div v-for="i in 4" :key="i" class="skeleton-card">
        <div class="sk-line w-2/3 h-5 mb-2"></div>
        <div class="sk-line w-full h-4"></div>
      </div>
    </div>

    <!-- 盒子列表 -->
    <template v-else>
      <div class="page-header">
        <h1 class="page-title">Done...</h1>
        <p class="page-subtitle">已掌握或不再关注的Skills</p>
      </div>

      <div v-if="doneSkills.length > 0" class="box-grid">
        <div v-for="skill in doneSkills" :key="skill.id" class="box-card">
          <StarCard :skill="skill" />
          <button class="restore-btn" @click="handleRestore(skill.id)">
            恢复到列表
          </button>
        </div>
      </div>

      <div v-else class="empty-state">
        <h3>盒子是空的</h3>
        <p>点击技能详情页的 Done 按钮，将已掌握的技能收纳到这里</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}
.page-header { margin-bottom: 28px; }
.page-title { font-size: 26px; font-weight: 700; color: var(--color-text-heading); }
.page-subtitle { font-size: 14px; color: var(--color-text-muted); margin-top: 4px; }

/* 登录提示 */
.auth-prompt {
  text-align: center;
  padding: 100px 20px;
}
.prompt-icon { color: var(--color-text-muted); margin-bottom: 16px; }
.auth-prompt h2 { font-size: 22px; font-weight: 600; color: var(--color-text-heading); margin-bottom: 8px; }
.auth-prompt p { font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px; }

.login-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 24px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  background: #111827; color: white; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
}
.login-btn:hover { background: #1f2937; transform: translateY(-1px); }

/* 骨架屏 */
.loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.skeleton-card { background: white; border: 1px solid var(--color-border); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.sk-line { border-radius: 6px; animation: pulse 1.8s infinite; background: linear-gradient(90deg,#f0f0f0 25%,#e5e7eb 50%,#f0f0f0); background-size: 200% 100%; }
@keyframes pulse { to { background-position: -200% 0; } }

/* 盒子网格 */
.box-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.box-card {
  position: relative;
}

.restore-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.restore-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #f0fdf4;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}
.empty-icon {
  color: var(--color-text-muted);
  opacity: 0.5;
}
.empty-state h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 16px;
  margin-bottom: 6px;
}
.empty-state p {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
