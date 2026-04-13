<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSkillsStore } from '../stores/skills'
import MarkdownEditor from '../components/editor/MarkdownEditor.vue'
import Toast from '../components/common/Toast.vue'

const router = useRouter()
const auth = useAuthStore()
const store = useSkillsStore()

const form = reactive({
  name: '',
  version: '1.0.0',
  summary: '',
  description: '',
  caseExample: '',
})

const submitting = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

// 版本号校验
const versionError = computed(() => {
  if (!form.version) return ''
  if (!/^\d+\.\d+\.\d+$/.test(form.version)) return '版本号格式应为 数字.数字.数字（如 1.0.0）'
  return ''
})

function canSubmit(): boolean {
  return !!(form.name.trim() && form.summary.trim() && form.description.length >= 100 && !versionError.value && !submitting.value)
}

async function handleSubmit() {
  if (!canSubmit()) return
  if (!auth.isLoggedIn || !auth.user) {
    auth.loginWithGitHub()
    return
  }

  submitting.value = true

  const result = await store.createSkill(
    {
      name: form.name.trim(),
      version: form.version.trim(),
      summary: form.summary.trim(),
      description: form.description,
      caseExample: form.caseExample,
    },
    auth.user.id,
    auth.user.name,
    auth.user.avatarUrl,
  )

  submitting.value = false

  if (result) {
    showToast('发布成功！✨', 'success')
    router.push(`/skill/${result.id}`)
  } else {
    showToast('发布失败，请重试', 'error')
  }
}

function handleCancel() {
  if (form.name || form.summary || form.description || form.caseExample) {
    if (!confirm('确定要取消吗？未保存的内容将丢失。')) return
  }
  router.back()
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMsg.value = msg
  toastType.value = type
}
</script>

<template>
  <div class="page-container">
    <Toast :message="toastMsg" :type="toastType" />

    <div class="page-header">
      <h1 class="page-title">发布新技能</h1>
      <p class="page-subtitle">填写以下信息来发布一个新技能</p>
    </div>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <!-- 技能名称 -->
      <div class="field-group">
        <label class="field-label">技能名称 <span class="required">*</span></label>
        <input
          v-model="form.name"
          type="text"
          class="field-input"
          placeholder="如：自动邮件回复、数据分析助手..."
          maxlength="100"
        />
      </div>

      <!-- 版本号 -->
      <div class="field-group">
        <label class="field-label">版本号 <span class="required">*</span></label>
        <input
          v-model="form.version"
          type="text"
          class="field-input"
          :class="{ error: versionError }"
          placeholder="1.0.0"
        />
        <p v-if="versionError" class="field-error">{{ versionError }}</p>
        <p v-else class="field-hint">首次发布默认 1.0.0。格式：数字.数字.数字</p>
      </div>

      <!-- 摘要 -->
      <div class="field-group">
        <label class="field-label">摘要 <span class="required">*</span></label>
        <textarea
          v-model="form.summary"
          class="field-textarea"
          placeholder="简要描述这个技能的功能和用途..."
          rows="3"
          maxlength="300"
        />
        <p class="field-count">{{ form.summary.length }}/300</p>
      </div>

      <!-- 使用说明 -->
      <div class="field-group">
        <label class="field-label">使用说明 <span class="required">*</span></label>
        <p class="field-hint">支持 Markdown 格式（代码块、列表、链接等），至少 100 字</p>
        <MarkdownEditor v-model="form.description" placeholder="# 使用说明..." />
        <p v-if="form.description.length > 0 && form.description.length < 100" class="field-error">使用说明至少需要 100 字，当前 {{ form.description.length }} 字</p>
        <p v-else class="field-count">{{ form.description.length }} 字</p>
      </div>

      <!-- 案例说明 -->
      <div class="field-group">
        <label class="field-label">案例说明</label>
        <p class="field-hint">支持 Markdown 格式</p>
        <MarkdownEditor v-model="form.caseExample" placeholder="# 案例..." />
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="handleCancel">取消</button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!canSubmit() || submitting"
        >
          {{ submitting ? '发布中...' : '发布技能' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}
.page-header { margin-bottom: 28px; }
.page-title { font-size: 24px; font-weight: 700; color: var(--color-text-heading); }
.page-subtitle { font-size: 14px; color: var(--color-text-muted); margin-top: 4px; }

.publish-form { display: flex; flex-direction: column; gap: 22px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 14px; font-weight: 600; color: var(--color-text-heading); }
.required { color: #ef4444; margin-left: 2px; }

.field-input, .field-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text-heading);
  background: var(--color-card-bg);
  outline: none;
  transition: all 0.2s;
}
.field-input:focus, .field-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
}
.field-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.06); }
.field-textarea { resize: vertical; min-height: 80px; line-height: 1.55; }

.field-error { font-size: 12px; color: #ef4444; }
.field-hint { font-size: 12px; color: var(--color-text-muted); }
.field-count { text-align: right; font-size: 11px; color: var(--color-text-muted); }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.btn {
  padding: 9px 24px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
}
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: default; }
.btn-secondary { background: transparent; color: var(--color-text-muted); border: 1px solid var(--color-border); }
.btn-secondary:hover { background: rgba(0,0,0,0.03); color: var(--color-text); }
</style>
