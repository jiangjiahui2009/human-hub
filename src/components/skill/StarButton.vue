<script setup lang="ts">
import { computed } from 'vue'
import { Star, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  count: number
  active?: boolean
  loading?: boolean
}>()

defineEmits<{
  toggle: []
}>()

const label = computed(() => props.active ? '取消收藏' : '收藏')
</script>

<template>
  <button
    class="star-btn"
    :class="{ active, loading }"
    :disabled="loading"
    :title="label"
    @click="$emit('toggle')"
  >
    <Loader2 v-if="loading" :size="16" class="spin" />
    <Star v-else :size="16" :fill="active ? 'currentColor' : 'none'" />
    <span class="count">{{ count }}</span>
  </button>
</template>

<style scoped>
.star-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.star-btn:hover:not(:disabled) {
  border-color: var(--color-star);
  color: var(--color-star-active);
  background: #fffbeb;
}

.star-btn.active {
  border-color: var(--color-star-active);
  color: var(--color-star-active);
  background: #fef3c7;
}

.star-btn.active:hover {
  background: #fde68a;
}

.star-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.count {
  font-variant-numeric: tabular-nums;
}
</style>
