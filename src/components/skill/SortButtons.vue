<script setup lang="ts">
import type { SortBy } from '../../types'

defineProps<{
  modelValue: SortBy
}>()

defineEmits<{
  'update:modelValue': [val: SortBy]
}>()

const options: { value: SortBy; label: string }[] = [
  { value: 'stars', label: 'Stars' },
  { value: 'newest', label: 'Newest' },
]
</script>

<template>
  <div class="sort-tags">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="sort-tag"
      :class="{ active: modelValue === opt.value }"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.sort-tags {
  display: flex;
  align-items: center;
  gap: 2px;
}

.sort-tag {
  padding: 4px 12px;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.sort-tag:hover {
  color: #6b7280;
  background: #f5f5f5;
}

.sort-tag.active {
  color: #111827;
  background: #f0f0f0;
  font-weight: 600;
}
</style>
