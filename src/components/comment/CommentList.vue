<script setup lang="ts">
import type { Comment } from '../../types'
import { Trash2 } from 'lucide-vue-next'

defineProps<{
  comments: Comment[]
  currentUserId?: string
}>()

const emit = defineEmits<{
  delete: [commentId: string]
}>()

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin} 分钟前`
  const diffHour = Math.floor(diffMin / 3600)
  if (diffHour < 24) return `${diffHour} 小时前`
  const diffDay = Math.floor(diffMin / 1440)
  if (diffDay < 30) return `${diffDay} 天前`
  return d.toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="comment-list">
    <div v-if="comments.length === 0" class="no-comments">
      暂无评论，来发表第一条吧
    </div>
    <div v-for="c in comments" :key="c.id" class="comment-item">
      <img
        v-if="c.userAvatar"
        :src="c.userAvatar"
        :alt="c.userName"
        class="avatar"
      />
      <div v-else class="avatar-placeholder">{{ c.userName.charAt(0).toUpperCase() }}</div>

      <div class="comment-body">
        <div class="comment-meta">
          <span class="author-name">{{ c.userName }}</span>
          <span class="time">{{ formatTime(c.createdAt) }}</span>
        </div>
        <p class="content">{{ c.content }}</p>
      </div>

      <button
        v-if="currentUserId && c.userId === currentUserId"
        class="delete-btn"
        title="删除评论"
        @click="$emit('delete', c.id)"
      >
        <Trash2 :size="13" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.no-comments {
  text-align: center;
  padding: 32px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.comment-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.avatar, .avatar-placeholder {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.avatar-placeholder {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.author-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-heading);
}
.time {
  font-size: 11px;
  color: var(--color-text-muted);
}
.content {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.5;
  word-break: break-word;
}

.delete-btn {
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 5px;
  opacity: 0;
  transition: all 0.15s;
  flex-shrink: 0;
}
.comment-item:hover .delete-btn {
  opacity: 1;
}
.delete-btn:hover {
  color: #ef4444;
  background: rgba(239,68,68,0.08);
}
</style>
