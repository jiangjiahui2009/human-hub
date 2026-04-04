<script lang="ts">
import MarkdownEditor from '../components/editor/MarkdownEditor.vue'
import Toast from '../components/common/Toast.vue'
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSkillsStore } from '../stores/skills'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const store = useSkillsStore()
const skillId = route.params.id as string

const form = reactive({
  name: '',
  version: '',
  summary: '',
  description: '',
  caseExample: '',
})

const loading = ref(true)
const saving = ref(false)
const notFound = ref(false)
const notAuthor = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

const versionError = computed(() => {
  if (!form.version) return ''
  if (!/^\d+\.\d+\.\d+$/.test(form.version)) return '格式：数字.数字.数字（如 1.0.1）'
  return ''
})

onMounted(async () => {
  const skill = await store.fetchSkill(skillId)
  if (!skill) {
    notFound.value = true
    loading.value = false
    return
  }

  // 权限检查
  if (auth.isLoggedIn && auth.user?.id !== skill.authorId) {
    notAuthor.value = true
    loading.value = false
    return
  }

  // 填充表单
  form.name = skill.name
  form.version = skill.version
  form.summary = skill.summary
  form.description = skill.description
  form.caseExample = skill.caseExample
  loading.value = false
})

function canSubmit(): boolean {
  return !!(form.name.trim() && form.summary.trim() && !versionError.value && !saving.value)
}

async function handleSubmit() {
  if (!canSubmit()) return

  saving.value = true
  const ok = await store.updateSkill(skillId, {
    name: form.name.trim(),
    version: form.version.trim(),
    summary: form.summary.trim(),
    description: form.description,
    caseExample: form.caseExample,
  })

  saving.value = false

  if (ok) {
    showToast('更新成功 ✨', 'success')
    router.push(`/skill/${skillId}`)
  } else {
    showToast('更新失败，请重试', 'error')
  }
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMsg.value = msg
  toastType.value = type
}
</script>

<template>
  <div class="page-container">
    <Toast :message="toastMsg" :type="toastType" />

    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">加载中...</div>

    <!-- 不存在 -->
    <div v-else-if="notFound" class="empty-state">
      <h3>技能不存在</h3>
      <p>可能已被删除或链接无效</p>
    </div>

    <!-- 无权限 -->
    <div v-else-if="notAuthor" class="empty-state">
      <h3>无权编辑</h3>
      <p>只有技能的作者才能编辑</p>
    </div>

    <!-- 编辑表单 -->
    <template v-else>
      <div class="page-header">
        <h1 class="page-title">编辑技能</h1>
        <p class="page-subtitle">修改 {{ form.name }} 的内容</p>
      </div>

      <form class="edit-form" @submit.prevent="handleSubmit">
        <div class="field-group">
          <label class="field-label">技能名称 <span class="required">*</span></label>
          <input v-model="form.name" type="text" class="field-input" maxlength="100" />
        </div>

        <div class="field-group">
          <label class="field-label">版本号 <span class="required">*</span></label>
          <input v-model="form.version" type="text" class="field-input" :class="{ error: versionError }" />
          <p v-if="versionError" class="field-error">{{ versionError }}</p>
          <p v-else class="field-hint">更新后可递增版本号（如 1.0.0 → 1.0.1）</p>
        </div>

        <div class="field-group">
          <label class="field-label">摘要 <span class="required">*</span></label>
          <textarea v-model="form.summary" class="field-textarea" rows="3" maxlength="300" />
          <p class="field-count">{{ form.summary.length }}/300</p>
        </div>

        <div class="field-group">
          <label class="field-label">使用说明</label>
          <MarkdownEditor v-model="form.description" />
        </div>

        <div class="field-group">
          <label class="field-label">案例说明</label>
          <MarkdownEditor v-model="form.caseExample" />
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$router.back()">取消</button>
          <button type="submit" class="btn btn-primary" :disabled="!canSubmit() || saving">
            {{ saving ? '保存中...' : '保存更改' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
/* 复用 Publish 的样式 */
.page-container { max-width: 720px; margin: 0 auto; padding: 32px 20px 80px; }
.page-header { margin-bottom: 28px; }
.page-title { font-size: 24px; font-weight: 700; color: var(--color-text-heading); }
.page-subtitle { font-size: 14px; color: var(--color-text-muted); margin-top: 4px; }

.edit-form { display: flex; flex-direction: column; gap: 22px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 14px; font-weight: 600; color: var(--color-text-heading); }
.required { color: #ef4444; margin-left: 2px; }

.field-input, .field-textarea {
  width: 100%; padding: 10px 14px; border: 1px solid var(--color-border);
  border-radius: 10px; font-size: 14px; font-family: inherit;
  color: var(--color-text-heading); background: var(--color-card-bg);
  outline: none; transition: all 0.2s;
}
.field-input:focus, .field-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
}
.field-input.error { border-color: #ef4444; }
.field-textarea { resize: vertical; min-height: 80px; line-height: 1.55; }
.field-error { font-size: 12px; color: #ef4444; }
.field-hint { font-size: 12px; color: var(--color-text-muted); }
.field-count { text-align: right; font-size: 11px; color: var(--color-text-muted); }

.form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid var(--color-border); }
.btn {
  padding: 9px 24px; border-radius: 9px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; border: none;
}
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: default; }
.btn-secondary { background: transparent; color: var(--color-text-muted); border: 1px solid var(--color-border); }
.btn-secondary:hover { background: rgba(0,0,0,0.03); color: var(--color-text); }

.empty-state, .loading-state { text-align: center; padding: 80px 20px; }
.loading-state { color: var(--color-text-muted); }
.empty-state h3 { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.empty-state p { color: var(--color-text-muted); font-size: 13px; }
</style>
