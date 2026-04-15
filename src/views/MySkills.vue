<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSkillsStore } from '../stores/skills'
import SkillCard from '../components/skill/SkillCard.vue'
import Toast from '../components/common/Toast.vue'
import { Edit3, Trash2, PlusCircle, MoreVertical } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const skillsStore = useSkillsStore()

const loading = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'info'>('success')
const skillToDelete = ref<string | null>(null)
const expandedSkillId = ref<string | null>(null)

// 获取当前用户发布的 skills
const mySkills = computed(() => {
  if (!auth.user) return []
  return skillsStore.skills.filter(s => s.authorId === auth.user!.id)
})

// 加载数据
onMounted(async () => {
  loading.value = true
  await skillsStore.fetchSkills()
  loading.value = false
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMsg.value = msg
  toastType.value = type
}

function goToPublish() {
  router.push('/publish')
}

function goToEdit(skillId: string) {
  router.push(`/edit/${skillId}`)
}

function confirmDelete(skillId: string) {
  skillToDelete.value = skillId
}

async function handleDelete() {
  if (!skillToDelete.value) return
  
  const success = await skillsStore.deleteSkill(skillToDelete.value)
  if (success) {
    showToast('Skill 已删除', 'success')
  } else {
    showToast('删除失败，请重试', 'error')
  }
  skillToDelete.value = null
}

function cancelDelete() {
  skillToDelete.value = null
}

function toggleActions(skillId: string) {
  expandedSkillId.value = expandedSkillId.value === skillId ? null : skillId
}

// 点击外部收起菜单
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.skill-actions-wrapper')) {
    expandedSkillId.value = null
  }
}
</script>

<template>
  <div class="my-skills-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">我的发布 ({{ mySkills.length }})</h1>
        <p class="page-subtitle">管理你创建的所有 Skill</p>
      </div>
      <button class="publish-btn" @click="goToPublish">
        <PlusCircle :size="18" />
        发布新 Skill
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="mySkills.length === 0" class="empty-state">
      <h3>还没有发布过 Skill</h3>
      <p>点击右上角按钮发布你的第一个 Skill</p>
    </div>

    <!-- Skill 列表 -->
    <div v-else class="skills-list">
      <div
        v-for="skill in mySkills"
        :key="skill.id"
        class="skill-item"
      >
        <div class="skill-card-wrapper">
          <SkillCard :skill="skill" />
        </div>
        <div class="skill-actions-wrapper">
          <button
            class="action-btn more-btn"
            :class="{ active: expandedSkillId === skill.id }"
            @click.stop="toggleActions(skill.id)"
            title="更多操作"
          >
            <MoreVertical :size="16" />
          </button>
          <div v-if="expandedSkillId === skill.id" class="actions-menu">
            <button class="menu-item edit" @click.stop="goToEdit(skill.id)" title="编辑">
              <Edit3 :size="14" />
              <span>编辑</span>
            </button>
            <button class="menu-item delete" @click.stop="confirmDelete(skill.id)" title="删除">
              <Trash2 :size="14" />
              <span>删除</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="skillToDelete" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>确认删除</h3>
        <p>确定要删除这个 Skill 吗？此操作不可恢复。</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="cancelDelete">取消</button>
          <button class="btn-danger" @click="handleDelete">删除</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" @close="toastMsg = ''" />
  </div>
</template>

<style scoped>
.my-skills-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.publish-btn:hover {
  background: #333333;
  transform: translateY(-2px);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6b7280;
  gap: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Skill 列表 */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.skill-card-wrapper {
  flex: 1;
  min-width: 0;
}

.skill-actions-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-top: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  background: #f9fafb;
}

.action-btn.more-btn {
  border: none;
  background: transparent;
}

.action-btn.more-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.more-btn.active {
  background: #f3f4f6;
  color: #111827;
}

.actions-menu {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 6px;
  padding: 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.menu-item:hover {
  background: #f9fafb;
}

.menu-item.edit:hover {
  background: #eff6ff;
  color: #2563eb;
}

.menu-item.delete:hover {
  background: #fef2f2;
  color: #ef4444;
}

/* 删除确认弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
}

.modal-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>
