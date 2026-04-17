<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { useSkillsStore } from '../../stores/skills'
import { CATEGORIES } from '../../lib/categories'
import { ref } from 'vue'

const store = useSkillsStore()

// 搜索框聚焦状态
const isFocused = ref(false)

function onInput(e: Event) {
  store.searchQuery = (e.target as HTMLInputElement).value
}

// 切换分类选择（多选）
function toggleCategory(category: string) {
  store.toggleCategory(category)
}

// 清空所有
function clearAll() {
  store.searchQuery = ''
  store.selectedCategories.splice(0)
}

// 聚焦搜索框
function onFocus() {
  isFocused.value = true
}

// 失焦搜索框（延迟关闭，让标签点击事件能先触发）
function onBlur() {
  setTimeout(() => {
    isFocused.value = false
  }, 150)
}
</script>

<template>
  <div class="search-bar-container">
    <div class="search-wrapper" :class="{ focused: isFocused }">
      <!-- 搜索输入区 -->
      <div class="input-row">
        <Search :size="16" class="search-icon" />
        <input
          type="text"
          class="search-input"
          placeholder="搜索技能..."
          :value="store.searchQuery"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
        
        <!-- 清除按钮 -->
        <button
          v-if="store.searchQuery || store.selectedCategories.length > 0"
          class="clear-btn"
          @click="clearAll"
        >
          <X :size="14" />
        </button>
      </div>
      
      <!-- 展开区域：技能类型标签 -->
      <div class="expand-area" :class="{ open: isFocused }">
        <div class="category-tags">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.value"
            class="category-tag"
            :class="{ active: store.selectedCategories.includes(cat.value) }"
            :style="{ '--tag-color': cat.color }"
            @mousedown.prevent="toggleCategory(cat.value)"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-bar-container {
  width: 100%;
  max-width: 400px;
  position: relative;
}

/* 外层包裹 - 统一边框 */
.search-wrapper {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.search-wrapper.focused {
  border-color: #111827;
}

/* 输入行 */
.input-row {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 36px;
  border: none;
  font-size: 13px;
  color: #111827;
  background: transparent;
  outline: none;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
  z-index: 1;
}

.clear-btn:hover {
  background: #d1d5db;
  color: #374151;
}

/* 展开区域 - 封闭在搜索框内 */
.expand-area {
  max-height: 0;
  overflow: hidden;
  border-top: 0px solid #f3f4f6;
}

.expand-area.open {
  max-height: 60px;
  padding: 8px 12px 10px 12px;
  border-top: 1px solid #f3f4f6;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  color: #6b7280;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.category-tag:hover {
  border-color: #d1d5db;
  color: #374151;
}

.category-tag.active {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #111827;
}
</style>