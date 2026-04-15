<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">确认发布</h3>
            <button class="modal-close" @click="handleCancel">
              <X :size="20" />
            </button>
          </div>

          <div class="modal-body">
            <!-- 技能名称（只读） -->
            <div class="form-group">
              <label class="form-label">技能名称</label>
              <div class="form-value readonly">{{ skillName }}</div>
            </div>

            <!-- 摘要（可编辑） -->
            <div class="form-group">
              <label class="form-label">
                摘要
                <span v-if="isGenerating" class="generating-badge">
                  <Loader2 :size="12" class="animate-spin" />
                  AI生成中...
                </span>
                <span v-else-if="!localSummary && !isGenerating" class="hint-badge">
                  AI生成失败，请手动填写
                </span>
              </label>
              <textarea
                v-model="localSummary"
                class="form-textarea"
                rows="3"
                placeholder="请填写技能摘要，简要描述核心功能..."
              />
            </div>

            <!-- 类别（单选） -->
            <div class="form-group">
              <label class="form-label">类别</label>
              <div class="category-grid">
                <button
                  v-for="cat in ALL_CATEGORIES"
                  :key="cat"
                  type="button"
                  class="category-option"
                  :class="{ selected: selectedCategory === cat }"
                  :style="getCategoryStyle(cat)"
                  @click="selectCategory(cat)"
                >
                  {{ CATEGORY_LABELS[cat] }}
                  <Check v-if="selectedCategory === cat" :size="14" class="check-icon" />
                </button>
              </div>
            </div>

            <!-- 标签（多选） -->
            <div class="form-group">
              <label class="form-label">
                标签
                <span class="optional-hint">（可选）</span>
              </label>
              <div class="tags-grid">
                <button
                  v-for="tag in ALL_TAG_KEYS"
                  :key="tag"
                  type="button"
                  class="tag-option"
                  :class="{ selected: selectedTags.includes(tag) }"
                  :style="getTagStyle(tag)"
                  @click="toggleTag(tag)"
                >
                  {{ TAG_LABELS[tag] }}
                  <Check v-if="selectedTags.includes(tag)" :size="14" class="check-icon" />
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="handleCancel" :disabled="isSubmitting">
              取消
            </button>
            <button
              class="btn btn-primary"
              @click="handleConfirm"
              :disabled="isSubmitting || !localSummary.trim()"
            >
              <Loader2 v-if="isSubmitting" :size="16" class="animate-spin" />
              <span>{{ isSubmitting ? '发布中...' : '确认发布' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Check, Loader2 } from 'lucide-vue-next'
import { ALL_TAG_KEYS, TAG_LABELS, getTagColors, type TagKey } from '../../lib/tags'
import { ALL_CATEGORIES, CATEGORY_LABELS, getCategoryColors, type SkillCategory } from '../../lib/categories'

interface Props {
  visible: boolean
  skillName: string
  summary: string
  tags: TagKey[]
  category?: SkillCategory
  isGenerating: boolean
  isSubmitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cancel: []
  confirm: [summary: string, tags: TagKey[], category: SkillCategory]
}>()

const localSummary = ref('')
const selectedTags = ref<TagKey[]>([])
const selectedCategory = ref<SkillCategory>('knowledge')

// 同步外部数据到本地
watch(
  () => props.summary,
  (newSummary) => {
    localSummary.value = newSummary
  },
  { immediate: true }
)

watch(
  () => props.tags,
  (newTags) => {
    selectedTags.value = [...newTags]
  },
  { immediate: true }
)

watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      selectedCategory.value = newCategory
    }
  },
  { immediate: true }
)

function toggleTag(tag: TagKey) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

function getTagStyle(tag: TagKey) {
  const colors = getTagColors(tag)
  const isSelected = selectedTags.value.includes(tag)

  if (isSelected) {
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      borderColor: colors.border,
    }
  }

  return {
    backgroundColor: 'transparent',
    color: '#6b7280',
    borderColor: '#e5e7eb',
  }
}

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  if (!localSummary.value.trim()) return
  emit('confirm', localSummary.value.trim(), selectedTags.value, selectedCategory.value)
}

function selectCategory(category: SkillCategory) {
  selectedCategory.value = category
}

function getCategoryStyle(category: SkillCategory) {
  const colors = getCategoryColors(category)
  const isSelected = selectedCategory.value === category

  if (isSelected) {
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      borderColor: colors.border,
    }
  }

  return {
    backgroundColor: 'transparent',
    color: '#6b7280',
    borderColor: '#e5e7eb',
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.optional-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 400;
}

.generating-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 400;
  background: #eff6ff;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.hint-badge {
  font-size: 0.75rem;
  color: #f59e0b;
  font-weight: 400;
  background: #fffbeb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.form-value.readonly {
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-textarea {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #111827;
  background: white;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea::placeholder {
  color: #9ca3af;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.category-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.category-option:hover {
  opacity: 0.8;
}

.category-option.selected {
  font-weight: 600;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.tag-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.tag-option:hover {
  opacity: 0.8;
}

.tag-option.selected {
  font-weight: 600;
}

.check-icon {
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
  .tags-grid {
    grid-template-columns: 1fr;
  }
}
</style>
