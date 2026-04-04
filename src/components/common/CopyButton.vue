<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

const props = defineProps<{
  text: string
}>()

const copied = ref(false)

async function doCopy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback for non-secure contexts
    const ta = document.createElement('textarea')
    ta.value = props.text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <button class="copy-btn" :class="{ copied }" @click="doCopy" title="复制全部内容">
    <Check v-if="copied" :size="15" />
    <Copy v-else :size="15" />
  </button>
</template>

<style scoped>
.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.copy-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #eff6ff;
}

.copy-btn.copied {
  border-color: #059669;
  color: #059669;
  background: #ecfdf5;
}
</style>
