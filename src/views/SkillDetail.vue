<script lang="ts">
import Toast from '../components/common/Toast.vue'
import CommentList from '../components/comment/CommentList.vue'
import CommentForm from '../components/comment/CommentForm.vue'
</script>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import sql from 'highlight.js/lib/languages/sql'
import { Star, MessageCircle, ArrowLeft, Copy, Check, Loader2 } from 'lucide-vue-next'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('sql', sql)

marked.setOptions({
  breaks: true,
})

const route = useRoute()
const router = useRouter()

const skill = ref<any>(null)
const comments = ref<any[]>([])
const loading = ref(true)
const starLoading = ref(false)
const isStarred = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'info'>('success')
const copied = ref(false)

let authStore: any = null
let skillsStore: any = null

onMounted(async () => {
  const { useAuthStore } = await import('../stores/auth')
  const { useSkillsStore } = await import('../stores/skills')
  authStore = useAuthStore()
  skillsStore = useSkillsStore()
  await loadData()
})

async function loadData() {
  loading.value = true
  // 确保列表数据已加载（刷新页面时 store 为空）
  if (skillsStore.skills.length === 0) {
    await skillsStore.fetchSkills()
  }
  const id = route.params.id as string
  const [skillData, commentsData] = await Promise.all([
    skillsStore.fetchSkill(id),
    skillsStore.fetchComments(id),
  ])
  skill.value = skillData
  comments.value = commentsData
  if (authStore?.isLoggedIn && authStore?.user) {
    isStarred.value = skillsStore.myStarredIds.has(id)
  }
  loading.value = false
}

function renderMd(text: string): string {
  if (!text) return ''
  return marked.parse(text) as string
}

const copyText = computed(() => {
  if (!skill.value) return ''
  return [
    `【技能名称】${skill.value.name}`,
    `【版本】v${skill.value.version}`,
    `【摘要】${skill.value.summary}`,
    '',
    `【使用说明】`,
    skill.value.description || '(无)',
    '',
    `【案例说明】`,
    skill.value.caseExample || '(无)',
  ].join('\n')
})

async function handleToggleStar() {
  if (!authStore?.isLoggedIn) {
    authStore.loginWithGitHub()
    return
  }
  starLoading.value = true
  const newStarred = await skillsStore.toggleStar(skill.value.id, authStore.user.id)
  isStarred.value = newStarred
  starLoading.value = false
  showToast(newStarred ? '已收藏 ✨' : '已取消收藏')
}

async function handleSubmitComment(content: string) {
  const c = await skillsStore.addComment(
    skill.value.id,
    authStore.user.id,
    authStore.user.name,
    authStore.user.avatarUrl,
    content,
  )
  if (c) comments.value.push(c)
  commentFormRef.value?.reset()
}
const commentFormRef = ref<any>(null)

async function handleDeleteComment(commentId: string) {
  await skillsStore.deleteComment(commentId, skill.value.id)
  comments.value = comments.value.filter(c => c.id !== commentId)
}

const isAuthor = computed(() =>
  authStore?.user?.id === skill.value?.authorId
)

function goBack() {
  // 优先返回上一页，如果没有历史记录则返回技能列表
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/skills')
  }
}

function goToEdit() {
  router.push(`/edit/${skill.value.id}`)
}

async function handleDelete() {
  if (!confirm('确定要删除这个技能吗？此操作不可撤销。')) return
  const ok = await skillsStore.deleteSkill(skill.value.id)
  if (ok) {
    showToast('已删除', 'success')
    router.push('/skills')
  }
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMsg.value = msg
  toastType.value = type
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(copyText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = copyText.value
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
  <div class="page-container">
    <Toast :message="toastMsg" :type="toastType" />

    <!-- 加载骨架 -->
    <div v-if="loading" class="loading-wrap">
      <div class="skeleton-detail">
        <div class="sk-line sk-h1 w-2/3"></div>
        <div class="sk-line sk-badge inline-block w-20"></div>
        <div class="sk-line sk-p w-full mt-4"></div>
        <div class="sk-line sk-p w-3/4 mt-2"></div>
        <div class="sk-line sk-stats w-48 mt-4"></div>
        <div class="sk-line sk-body w-full h-40 mt-6"></div>
      </div>
    </div>

    <!-- 技能不存在 -->
    <div v-else-if="!skill" class="empty-state">
      <h3>技能不存在</h3>
      <p>可能已被删除或链接无效</p>
      <button class="back-btn" @click="goBack">返回列表</button>
    </div>

    <!-- 详情内容 -->
    <template v-else>
      <!-- 顶部导航栏 -->
      <div class="top-bar">
        <button class="back-link" @click="goBack">
          <ArrowLeft :size="16" />
          返回列表
        </button>
        <div v-if="isAuthor" class="owner-actions">
          <button class="action-link edit" @click="goToEdit">编辑</button>
          <button class="action-link delete" @click="handleDelete">删除</button>
        </div>
      </div>

      <!-- 头部信息区 + 内容区：合并为一个整体 -->
      <div class="detail-card">
        <!-- 头部信息区：左右分栏 -->
        <div class="detail-header">
          <!-- 左侧：标题、摘要、作者、统计 -->
          <div class="header-left">
            <!-- 技能名称 -->
            <h1 class="skill-name">{{ skill.name }}</h1>

            <!-- 摘要 -->
            <p class="skill-summary">{{ skill.summary }}</p>

            <!-- 作者 + 统计 -->
            <div class="author-row">
              <div class="author-chip">
                <span class="author-name">@{{ skill.authorName }}</span>
              </div>
              <span class="meta-divider"></span>
              <span class="meta-item">
                <Star :size="14" />
                {{ skill.starsCount }}
              </span>
              <span class="meta-item">
                <MessageCircle :size="14" />
                {{ skill.commentsCount }}
              </span>
            </div>
          </div>

          <!-- 右侧：操作栏 -->
          <div class="header-right">
            <div class="icon-actions">
              <button
                class="icon-action"
                :class="{ active: isStarred }"
                :disabled="starLoading"
                :title="isStarred ? '取消收藏' : '收藏'"
                @click="handleToggleStar"
              >
                <Loader2 v-if="starLoading" :size="18" class="spin" />
                <Star v-else :size="18" :fill="isStarred ? 'currentColor' : 'none'" />
              </button>
              <button class="icon-action" title="复制全部内容" @click="handleCopy">
                <Check v-if="copied" :size="18" />
                <Copy v-else :size="18" />
              </button>
            </div>
          </div>
        </div>

        <!-- 内容区：合并展示 -->
        <div class="content-area">
          <!-- 使用说明 -->
          <div class="content-section" v-if="skill.description">
            <div class="markdown-body" v-html="renderMd(skill.description)" />
          </div>

          <!-- 案例说明 -->
          <div class="content-section" v-if="skill.caseExample">
            <h3 class="section-label">案例说明</h3>
            <div class="markdown-body" v-html="renderMd(skill.caseExample)" />
          </div>

          <!-- 都为空 -->
          <p v-if="!skill.description && !skill.caseExample" class="empty-content">暂无详细说明</p>
        </div>
      </div>

      <!-- 评论区 -->
      <section class="comment-section">
        <h2 class="section-title">
          <MessageCircle :size="18" />
          评论（{{ comments.length }}）
        </h2>
        <CommentList
          :comments="comments"
          :currentUserId="authStore?.user?.id"
          @delete="handleDeleteComment"
        />
        <CommentForm v-if="authStore?.isLoggedIn" ref="commentFormRef" @submit="handleSubmitComment" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 880px;
  margin: 0 auto;
  padding: 24px 24px 80px;
}

/* ===== 加载骨架 ===== */
.loading-wrap { padding-top: 20px; }
.skeleton-detail {
  display: flex; flex-direction: column; gap: 12px;
  padding: 32px; background: white; border-radius: 10px;
  border: 1px solid var(--color-border, #e5e7eb);
}
.sk-line {
  border-radius: 6px;
  animation: pulse 1.8s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e7eb 50%, #f0f0f0);
  background-size: 200% 100%;
}
.sk-h1 { height: 32px; } .sk-badge { height: 28px; } .sk-p { height: 18px; }
.sk-stats { height: 20px; } .sk-body { height: 160px; }
.w-full { width: 100%; } .w-2\/3 { width: 66%; } .w-20 { width: 80px; }
.w-3\/4 { width: 75%; } .w-48 { width: 192px; }
.inline-block { display: inline-block; } .mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; } .mt-6 { margin-top: 24px; }
@keyframes pulse { to { background-position: -200% 0; } }

/* ===== 顶部导航 ===== */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted, #6b7280);
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  background: none;
  border: none;
  transition: color 0.15s;
}
.back-link:hover { color: var(--color-text-heading, #1a1a2e); }
.owner-actions { display: flex; gap: 8px; }
.action-link {
  padding: 5px 14px;
  border-radius: 6px;
  border: 1px solid var(--color-border, #e5e7eb);
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.action-link.edit:hover { border-color: var(--color-primary, #2563eb); color: var(--color-primary, #2563eb); background: #eff6ff; }
.action-link.delete:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

/* ===== 详情卡片：头部 + 内容合并 ===== */
.detail-card {
  background: var(--color-card-bg, #fff);
  border-radius: 10px;
  margin-bottom: 24px;
  overflow: hidden;
}

/* ===== 头部信息区：左右分栏 ===== */
.detail-header {
  display: flex;
  gap: 24px;
  padding: 28px 32px 24px;
  align-items: flex-start;
}
.header-left {
  flex: 0 0 80%;
  min-width: 0;
}
.header-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 0;
  overflow: hidden;
}
.skill-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-heading, #1a1a2e);
  letter-spacing: -0.3px;
  line-height: 1.3;
}
.skill-summary {
  margin-top: 12px;
  font-size: 15px;
  color: var(--color-text-muted, #9ca3af);
  line-height: 1.6;
}

/* 作者行 */
.author-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.author-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.author-avatar, .author-avatar-placeholder {
  width: 24px; height: 24px; border-radius: 50%;
  object-fit: cover; flex-shrink: 0;
}
.author-avatar-placeholder {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
}
.author-name {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-muted, #9ca3af);
}

.meta-divider {
  width: 1px;
  height: 16px;
  background: var(--color-border, #d1d5db);
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}
.meta-item svg { opacity: 0.7; }

/* 右侧操作栏 */
.learn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.learn-btn:hover {
  background: #1d4ed8;
}

.learn-hint {
  font-size: 11px;
  color: #9ca3af;
  text-align: left;
  line-height: 1.4;
  max-width: 100%;
}

.icon-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--color-text-muted, #9ca3af);
  cursor: pointer;
  transition: all 0.2s ease;
}
.icon-action:hover {
  color: var(--color-primary, #2563eb);
  background: #eff6ff;
}
.icon-action.active {
  color: var(--color-star-active, #f59e0b);
}
.icon-action.active:hover {
  background: #fffbeb;
}
.icon-action:disabled {
  opacity: 0.6;
  cursor: default;
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 内容区 (合并展示) ===== */
.content-area {
  padding: 24px 32px;
}
.content-section {
  margin-bottom: 32px;
}
.content-section:last-child {
  margin-bottom: 0;
}
.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-heading, #1a1a2e);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}
.empty-content {
  color: var(--color-text-muted, #9ca3af);
  font-style: italic;
  text-align: center;
  padding: 40px 0;
}


/* ===== 评论 ===== */
.comment-section {
  background: var(--color-card-bg, #fff);
  border-radius: 10px;
  padding: 24px 32px;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-heading, #1a1a2e);
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}
.section-title svg { opacity: 0.6; }

/* ===== 空状态 ===== */
.empty-state { text-align: center; padding: 80px 20px; }
.empty-state h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
.empty-state p { color: var(--color-text-muted); font-size: 13px; margin-bottom: 20px; }
.back-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.back-btn:hover { border-color: var(--color-primary, #2563eb); color: var(--color-primary, #2563eb); }

/* ===== Markdown 正文样式 ===== */
.markdown-body {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text, #374151);
  word-break: break-word;
}
.markdown-body :deep(h1) { font-size: 20px; font-weight: 700; margin: 24px 0 12px; }
.markdown-body :deep(h2) { font-size: 17px; font-weight: 600; margin: 20px 0 10px; }
.markdown-body :deep(h3) { font-size: 15px; font-weight: 600; margin: 16px 0 8px; }
.markdown-body :deep(p) { margin: 0 0 12px; }
.markdown-body :deep(ul),
.markdown-body :deep(ol) { margin: 0 0 12px; padding-left: 24px; }
.markdown-body :deep(li) { margin-bottom: 4px; }
.markdown-body :deep(code) {
  padding: 2px 6px; border-radius: 4px;
  background: #f3f4f6; font-size: 13px; font-family: 'SF Mono', Menlo, monospace;
}
.markdown-body :deep(pre) {
  padding: 16px; border-radius: 8px; overflow-x: auto;
  background: #1e1e2e; color: #cdd6f4; margin: 16px 0;
}
.markdown-body :deep(pre code) {
  background: none; padding: 0; color: inherit; font-size: 13px;
}
.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-primary, #2563eb);
  padding: 4px 16px; margin: 12px 0;
  color: var(--color-text-muted, #6b7280);
  background: #f9fafb; border-radius: 0 6px 6px 0;
}
.markdown-body :deep(a) {
  color: var(--color-primary, #2563eb);
  text-decoration: none;
}
.markdown-body :deep(a:hover) { text-decoration: underline; }
.markdown-body :deep(table) {
  width: 100%; border-collapse: collapse; margin: 12px 0;
  font-size: 13px;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--color-border, #e5e7eb);
  padding: 8px 12px; text-align: left;
}
.markdown-body :deep(th) {
  background: #f9fafb; font-weight: 600;
}
.markdown-body :deep(hr) {
  border: none; border-top: 1px solid var(--color-border, #e5e7eb);
  margin: 20px 0;
}
.markdown-body :deep(img) { max-width: 100%; border-radius: 8px; margin: 8px 0; }
</style>
