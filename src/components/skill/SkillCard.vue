<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Skill } from '../../types'
import { Star as StarIcon, MessageCircle } from 'lucide-vue-next'
import { TAG_LABELS, getTagColors, type TagKey } from '../../lib/tags'

const props = defineProps<{
  skill: Skill
}>()

const router = useRouter()

function goToDetail() {
  router.push(`/skill/${props.skill.id}`)
}

// 获取标签样式
function getTagStyle(tag: TagKey) {
  const colors = getTagColors(tag)
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    borderColor: colors.border,
  }
}
</script>

<template>
  <div class="skill-row" @click="goToDetail">
    <!-- SKILL 列 -->
    <div class="col col-skill">
      <div class="skill-name">{{ skill.name }}</div>
      <div class="skill-meta">
        <!-- 标签列表 -->
        <span v-if="skill.tags && skill.tags.length > 0" class="skill-tags">
          <span
            v-for="tag in skill.tags"
            :key="tag"
            class="skill-tag"
            :style="getTagStyle(tag as TagKey)"
          >
            {{ TAG_LABELS[tag as TagKey] }}
          </span>
        </span>
      </div>
    </div>

    <!-- SUMMARY 列 -->
    <div class="col col-summary">{{ skill.summary }}</div>

    <!-- AUTHOR 列 -->
    <div class="col col-author">@{{ skill.authorName }}</div>

    <!-- STATS 列 -->
    <div class="col col-stats">
      <span class="stat">
        <StarIcon :size="13" fill="#374151" stroke="#374151" :stroke-width="1.5" />
        {{ skill.starsCount }}
      </span>
      <span class="stat">
        <MessageCircle :size="13" :stroke-width="1.8" color="#374151" />
        {{ skill.commentsCount }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.skill-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 4px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.1s ease;
}

.skill-row:last-child {
  border-bottom: none;
}

.skill-row:hover {
  background-color: #fafafa;
}

/* 列通用 */
.col {
  overflow: hidden;
  min-width: 0;
}

/* SKILL 列 */
.col-skill {
  flex: 1.8;
  min-width: 0;
  padding-right: 24px;
}
.skill-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}
.skill-row:hover .skill-name {
  color: #2563eb;
}
.skill-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-tag {
  padding: 1px 6px;
  border: 1px solid;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
}

/* SUMMARY 列：固定3行高度 */
.col-summary {
  flex: 4;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-right: 20px;
  min-height: calc(13px * 1.5 * 3); /* 字体大小 * 行高 * 3行 */
}

/* AUTHOR 列 */
.col-author {
  flex: 1.5;
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  padding-top: 1px;
}

/* STATS 列 */
.col-stats {
  flex: 1.2;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex-shrink: 0;
  padding-top: 2px;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #374151;
}
</style>
