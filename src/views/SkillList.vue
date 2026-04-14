<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { useSkillsStore } from '../stores/skills'
import { useAuthStore } from '../stores/auth'
import SkillCard from '../components/skill/SkillCard.vue'
import SearchBar from '../components/skill/SearchBar.vue'
import SortButtons from '../components/skill/SortButtons.vue'
import Toast from '../components/common/Toast.vue'

const store = useSkillsStore()
const auth = useAuthStore()
const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

// 无限滚动
const sentinelRef = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && store.hasMore) {
        store.loadMore()
      }
    },
    { rootMargin: '200px' }
  )
  nextTick(() => {
    if (sentinelRef.value) observer!.observe(sentinelRef.value)
  })
}

onMounted(async () => {
  await store.fetchSkills()

  if (auth.isLoggedIn && auth.user) {
    await store.fetchMyStars(auth.user.id)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault()
      const el = document.querySelector('.search-input') as HTMLInputElement
      el?.focus()
    }
  }
  document.addEventListener('keydown', onKeyDown)

  setupObserver()
})

watch(() => [store.hasMore, store.searchQuery, store.sortBy], () => {
  nextTick(setupObserver)
})

// showToast 函数保留供后续使用
function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMsg.value = msg
  toastType.value = type
}
// 标记为已使用，避免 TS 报错
void showToast
</script>

<template>
  <div class="page-container">
    <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" />

    <!-- 页面头部：标题 + 副标题 -->
    <div class="page-header">
      <h1 class="page-title">Skills</h1>
      <p class="page-subtitle">为人类自己升级</p>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <SearchBar />
    </div>

    <!-- 排序标签 -->
    <div class="sort-section">
      <SortButtons v-model="store.sortBy" />
    </div>

    <!-- 列表容器 -->
    <div v-if="!store.loading && store.filteredSkills.length > 0" class="list-container">
      <!-- 表头 -->
      <div class="list-header">
        <div class="th th-skill">SKILL</div>
        <div class="th th-summary">SUMMARY</div>
        <div class="th th-author">AUTHOR</div>
        <div class="th th-stats">STATS</div>
      </div>
      <div class="skill-list">
        <SkillCard
          v-for="skill in store.visibleSkills"
          :key="skill.id"
          :skill="skill"
        />
      </div>

      <!-- 加载更多（无限滚动触发） -->
      <div v-if="store.hasMore" ref="sentinelRef" class="load-more-wrap">
        <span class="load-more-text">loading more</span>
      </div>
    </div>

    <!-- 加载骨架屏 -->
    <div v-else-if="store.loading" class="skill-list">
      <div v-for="i in 6" :key="i" class="skeleton-row">
        <div class="skeleton-col" style="flex:1.8"><div class="skeleton-line" style="width:60%"></div><div class="skeleton-line short" style="width:30%"></div></div>
        <div class="skeleton-col" style="flex:4"><div class="skeleton-line" style="width:90%"></div><div class="skeleton-line short" style="width:60%"></div></div>
        <div class="skeleton-col" style="flex:1.5"><div class="skeleton-line short" style="width:60%"></div></div>
        <div class="skeleton-col" style="flex:1.2"><div class="skeleton-line short" style="width:50%"></div></div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <h3 v-if="store.searchQuery">没有找到匹配的技能</h3>
      <h3 v-else>还没有技能</h3>
      <p v-if="store.searchQuery">试试其他关键词搜索</p>
      <p v-else>成为第一个发布技能的人吧！</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.page-header {
  margin-bottom: 24px;
}
.page-title {
  font-size: 24px;
  font-weight: 300;
  color: #111827;
  letter-spacing: -0.3px;
}
.page-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin-top: 4px;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 16px;
}

/* 排序标签 */
.sort-section {
  margin-bottom: 8px;
}

/* 列表容器 */
.list-container {
  border-top: 1px solid #f0f0f0;
}

/* 表头 */
.list-header {
  display: flex;
  align-items: center;
  padding: 10px 4px;
  border-bottom: 1px solid #f5f5f5;
}

.th {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.th-skill { flex: 1.8; min-width: 0; padding-right: 24px; }
.th-summary { flex: 4; min-width: 0; padding-right: 20px; }
.th-author { flex: 1.5; min-width: 0; }
.th-stats { flex: 1.2; flex-shrink: 0; }

/* 列表区域 */
.skill-list {
  display: flex;
  flex-direction: column;
}

/* 骨架屏 */
.skeleton-row {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}
.skeleton-col {
  overflow: hidden;
  padding: 0 4px;
}
.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: pulse 1.8s ease-in-out infinite;
}
.skeleton-line.short {
  height: 12px;
  margin-top: 6px;
}
@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #9ca3af;
}
.empty-state h3 {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-top: 16px;
  margin-bottom: 6px;
}
.empty-state p {
  font-size: 13px;
}

/* 加载更多 */
.load-more-wrap {
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
}

.load-more-text {
  font-size: 12px;
  color: #c0c0c0;
  letter-spacing: 0.5px;
}
</style>
