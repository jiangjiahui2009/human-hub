<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useSkillsStore } from '../../stores/skills'

const store = useSkillsStore()

function onInput(e: Event) {
  store.searchQuery = (e.target as HTMLInputElement).value
}
</script>

<template>
  <div class="search-bar">
    <Search :size="16" class="search-icon" />
    <input
      type="text"
      class="search-input"
      placeholder="搜索技能..."
      :value="store.searchQuery"
      @input="onInput"
    />
    <kbd v-if="!store.searchQuery" class="search-kbd">/</kbd>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 36px 0 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  outline: none;
  transition: all 0.15s;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.08);
}

.search-kbd {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0px 5px;
  border-radius: 3px;
  font-size: 11px;
  font-family: inherit;
  color: #9ca3af;
  background: #f5f5f5;
  border: 1px solid #e5e7eb;
  pointer-events: none;
}
</style>
