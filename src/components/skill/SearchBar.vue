<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useSkillsStore } from '../../stores/skills'
import { ALL_TAG_KEYS, TAG_LABELS, getTagColors, type TagKey } from '../../lib/tags'
import { CATEGORIES, type SkillCategory } from '../../lib/categories'

const store = useSkillsStore()
const isExpanded = ref(false)

// 标签列表
const tags = computed(() => ALL_TAG_KEYS)

// 获取标签样式
function getTagStyle(tag: TagKey) {
  const colors = getTagColors(tag)
  const isSelected = store.selectedTags.includes(tag)
  return {
    backgroundColor: isSelected ? colors.bg : '#ffffff',
    color: isSelected ? colors.text : '#6b7280',
    borderColor: isSelected ? colors.border : '#e5e7eb',
  }
}

// 切换标签
function toggleTag(tag: TagKey) {
  store.toggleTag(tag)
}

// 清空所有标签
function clearTags() {
  store.clearSelectedTags()
}

// 获取类别标签样式
function getCategoryStyle(category: SkillCategory) {
  const isSelected = store.selectedCategory === category
  const cat = CATEGORIES.find(c => c.value === category)!
  return {
    backgroundColor: isSelected ? cat.color + '20' : '#ffffff',
    color: isSelected ? cat.color : '#6b7280',
    borderColor: isSelected ? cat.color : '#e5e7eb',
  }
}

// 切换类别
function toggleCategory(category: SkillCategory) {
  store.setCategory(store.selectedCategory === category ? null : category)
}

// 清空搜索
function clearSearch() {
  store.searchQuery = ''
}

// 聚焦时展开
function onFocus() {
  isExpanded.value = true
}

// 点击外部关闭（可选，如果需要的话）
function onBlur() {
  // 延迟关闭，让点击标签的事件先触发
  setTimeout(() => {
    isExpanded.value = false
  }, 200)
}

function onInput(e: Event) {
  store.searchQuery = (e.target as HTMLInputElement).value
}
</script>

<template>
  <div class="search-bar-container">
    <div class="search-bar" :class="{ 'is-expanded': isExpanded }">
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
      <button
        v-if="store.searchQuery"
        class="clear-btn"
        @click="clearSearch"
      >
        <X :size="14" />
      </button>
      <kbd v-else class="search-kbd">/</kbd>
    </div>

    <!-- 标签筛选面板 -->
    <div v-show="isExpanded" class="tag-panel">
      <!-- 功能标签 -->
      <div class="tag-section">
        <div class="tag-panel-header">
          <span class="tag-panel-title">问题场景</span>
          <button
            v-if="store.selectedTags.length > 0"
            class="clear-tags-btn"
            @click="clearTags"
          >
            清空
          </button>
        </div>
        <div class="tag-list">
          <button
            v-for="tag in tags"
            :key="tag"
            class="tag-item"
            :class="{ 'is-selected': store.selectedTags.includes(tag) }"
            :style="getTagStyle(tag)"
            @click="toggleTag(tag)"
          >
            {{ TAG_LABELS[tag] }}
          </button>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="divider" />

      <!-- 类别标签 -->
      <div class="category-section">
        <div class="tag-panel-header">
          <span class="tag-panel-title">技能类型</span>
          <button
            v-if="store.selectedCategory"
            class="clear-tags-btn"
            @click="store.setCategory(null)"
          >
            清空
          </button>
        </div>
        <div class="tag-list">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.value"
            class="tag-item"
            :class="{ 'is-selected': store.selectedCategory === cat.value }"
            :style="getCategoryStyle(cat.value)"
            @click="toggleCategory(cat.value)"
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
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-bar {
  position: relative;
  width: 100%;
  border-radius: 8px;
  transition: all 0.15s;
}

.search-bar.is-expanded {
  border-radius: 8px 8px 0 0;
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
}

.clear-btn:hover {
  background: #d1d5db;
  color: #374151;
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

/* 标签面板 */
.tag-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.tag-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tag-panel-title {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.clear-tags-btn {
  font-size: 11px;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s;
}

.clear-tags-btn:hover {
  color: #dc2626;
  background: #fee2e2;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: #ffffff;
}

.tag-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.tag-item.is-selected {
  font-weight: 600;
}

/* 类别标签区域 */
.category-section {
  margin-bottom: 12px;
}

/* 功能标签区域 */
.tag-section {
  margin-top: 12px;
}

/* 分隔线 */
.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 12px 0;
}
</style>
