<script setup lang="ts">
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'

const emit = defineEmits<{
  submit: [content: string]
}>()

const content = ref('')
const submitting = ref(false)

async function handleSubmit() {
  const trimmed = content.value.trim()
  if (!trimmed || submitting.value) return
  submitting.value = true
  emit('submit', trimmed)
  // 父组件负责清空和重置 submitting
}

function reset() {
  content.value = ''
  submitting.value = false
}

defineExpose({ reset })
</script>

<template>
  <div class="comment-form">
    <textarea
      v-model="content"
      class="input-area"
      placeholder="写下你的评论..."
      rows="2"
      :disabled="submitting"
      @keydown.ctrl.enter="handleSubmit"
      @keydown.meta.enter="handleSubmit"
    />
    <div class="form-actions">
      <span class="hint">Ctrl + Enter 发送</span>
      <button
        class="submit-btn"
        :disabled="!content.trim() || submitting"
        @click="handleSubmit"
      >
        <Send :size="14" />
        发表
      </button>
    </div>
  </div>
</template>

<style scoped>
.comment-form {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
}

.input-area {
  width: 100%;
  border: none;
  background: transparent;
  resize: vertical;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text-heading);
  line-height: 1.55;
  min-height: 48px;
}

.input-area::placeholder {
  color: var(--color-text-muted);
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.hint {
  font-size: 11px;
  color: var(--color-text-muted);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 16px;
  border-radius: 7px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-heading);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-bg);
  border-color: var(--color-text-muted);
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
