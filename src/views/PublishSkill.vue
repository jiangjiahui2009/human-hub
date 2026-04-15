<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSkillsStore } from '../stores/skills'
import MarkdownEditor from '../components/editor/MarkdownEditor.vue'
import Toast from '../components/common/Toast.vue'
import PublishConfirmModal from '../components/common/PublishConfirmModal.vue'
import { generateSummary } from '../lib/ai'
import type { TagKey } from '../lib/tags'
import type { SkillCategory } from '../types'

const router = useRouter()
const auth = useAuthStore()
const store = useSkillsStore()

const form = reactive({
  name: '',
  description: '',
})



const submitting = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

// 确认弹框状态
const showConfirmModal = ref(false)
const generatedSummary = ref('')
const selectedTags = ref<TagKey[]>([])
const selectedCategory = ref<SkillCategory>('knowledge')
const isGenerating = ref(false)

function canSubmit(): boolean {
  return !!(form.name.trim() && form.description.length >= 100 && !submitting.value)
}

async function handlePublishClick() {
  if (!canSubmit()) return
  if (!auth.isLoggedIn || !auth.user) {
    auth.loginWithGitHub()
    return
  }

  // 重置状态
  generatedSummary.value = ''
  selectedTags.value = []
  isGenerating.value = true
  showConfirmModal.value = true

  // 调用 AI 生成摘要
  try {
    const summary = await generateSummary(form.description, { minLength: 30, maxLength: 100 })
    generatedSummary.value = summary
  } catch (error) {
    console.error('生成摘要失败:', error)
    generatedSummary.value = ''
  } finally {
    isGenerating.value = false
  }
}

async function handleConfirm(summary: string, tags: TagKey[], category: SkillCategory) {
  submitting.value = true

  const result = await store.createSkill(
    {
      name: form.name.trim(),
      summary: summary,
      description: form.description,
      caseExample: '',
      tags: tags,
      category: category,
    },
    auth.user!.id,
    auth.user!.name,
    auth.user!.avatarUrl,
  )

  submitting.value = false
  showConfirmModal.value = false

  if (result) {
    showToast('发布成功！✨', 'success')
    router.push('/my-skills')
  } else {
    showToast('发布失败，请重试', 'error')
  }
}

function handleCancelModal() {
  showConfirmModal.value = false
  submitting.value = false
}

function handleCancel() {
  if (form.name || form.description) {
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
  <div class="immersive-page">
    <Toast :message="toastMsg" :type="toastType" />

    <!-- 顶部极简导航 -->
    <header class="immersive-header">
      <button class="back-btn" @click="handleCancel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <button
        class="publish-btn"
        :disabled="!canSubmit() || submitting"
        @click="handlePublishClick"
      >
        {{ submitting ? '处理中...' : '发布' }}
      </button>
    </header>

    <!-- 沉浸式编辑区域 -->
    <main class="immersive-editor">
      <!-- 技能名称 - 大标题样式 -->
      <input
        v-model="form.name"
        type="text"
        class="title-input"
        placeholder="输入技能名称..."
        maxlength="100"
      />

      <!-- 使用说明 - 富文本编辑器 -->
      <div class="editor-wrapper">
        <MarkdownEditor 
          v-model="form.description" 
          placeholder="开始编写使用说明..." 
          class="immersive-markdown"
        />
      </div>

      <!-- 字数提示 -->
      <div class="editor-footer">
        <span v-if="form.description.length > 0 && form.description.length < 100" class="word-count hint">
          至少 100 字，当前 {{ form.description.length }} 字
        </span>
        <span v-else class="word-count">{{ form.description.length }} 字</span>
      </div>
    </main>

    <!-- 发布确认弹框 -->
    <PublishConfirmModal
      :visible="showConfirmModal"
      :skill-name="form.name"
      :summary="generatedSummary"
      :tags="selectedTags"
      :category="selectedCategory"
      :is-generating="isGenerating"
      :is-submitting="submitting"
      @cancel="handleCancelModal"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
/* 沉浸式页面布局 */
.immersive-page {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 60px;
}

/* 顶部极简导航 */
.immersive-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(250, 250, 250, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.publish-btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.publish-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.publish-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 沉浸式编辑区域 */
.immersive-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 40px 80px;
}

/* 大标题输入框 */
.title-input {
  width: 100%;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  margin-bottom: 32px;
  font-family: inherit;
  line-height: 1.3;
}

.title-input::placeholder {
  color: #c0c0c0;
}

/* 编辑器包装 */
.editor-wrapper {
  min-height: 500px;
}

/* 编辑器页脚 */
.editor-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: flex-end;
}

.word-count {
  font-size: 13px;
  color: #999;
}

.word-count.hint {
  color: #f59e0b;
}

/* 深度定制 MarkdownEditor 样式 */
:deep(.immersive-markdown) {
  border: none;
  background: transparent;
}

:deep(.immersive-markdown .editor-toolbar) {
  border: none;
  background: transparent;
  padding: 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.immersive-markdown .editor-content) {
  border: none;
  background: transparent;
  min-height: 400px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

:deep(.immersive-markdown .editor-content:focus) {
  outline: none;
  box-shadow: none;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .immersive-header {
    padding: 0 16px;
    height: 56px;
  }

  .immersive-editor {
    padding: 80px 20px 60px;
  }

  .title-input {
    font-size: 24px;
    margin-bottom: 24px;
  }

  :deep(.immersive-markdown .editor-content) {
    font-size: 15px;
  }
}
</style>
