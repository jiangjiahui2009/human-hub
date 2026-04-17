<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 宇航员图片（用变量而非字面量，避免 Vite 静态分析报错）
const astronautSrc = '/astronaut.png'
const astronautImgLoaded = ref(false)

// 8张卡片数据
const cards = [
  {
    id: 1,
    title: '如何产生项目点子？',
    items: ['如何想到能做什么？', '如何知道能解决什么问题？'],
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.18)',
    tagKey: 'generate_ideas',
  },
  {
    id: 2,
    title: '如何表达清楚需求？',
    items: ['如何逐步表达，靠近最终目标？', '如何从模糊需求，变成精准需求？'],
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.18)',
    tagKey: 'optimize_expression',
  },
  {
    id: 3,
    title: '如何让 Agent 发挥最佳水平？',
    items: ['如何让 AI 最快找到最佳路径和方法？', '如何长程记忆、权限干预等？'],
    color: '#10b981',
    glow: 'rgba(16,185,129,0.18)',
    tagKey: 'unlock_agent',
  },
  {
    id: 4,
    title: '如何减少返工？',
    items: ['如何减少设计返工？', '如何减少研发返工？'],
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
    tagKey: 'reduce_rework',
  },
  {
    id: 5,
    title: '如何更高效率修复 Bug？',
    items: ['如何让 AI 更快的改好 bug？', '如何优化调试效率？'],
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.18)',
    tagKey: 'bug_fix',
  },
  {
    id: 6,
    title: '如何优化 Token 消耗？',
    items: ['如何用小成本完成目标？'],
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.18)',
    tagKey: 'token_usage',
  },
  {
    id: 7,
    title: '如何让多 Agent 协作持续工作？',
    items: ['如何让 AI 无人值守稳定跑24 小时？', '如何让多 Agent 编排协作？'],
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.18)',
    tagKey: 'multi_agent',
  },
  {
    id: 8,
    title: '如何让开发产物更加稳定成熟？',
    items: ['如何做版本管理与迭代？', '如何让Vibe code 产物活过生产环境？'],
    color: '#f97316',
    glow: 'rgba(249,115,22,0.18)',
    tagKey: 'production',
  },
]

// 跳转到问题详情页
function goToQuestion(tagKey: string) {
  router.push(`/question/${tagKey}`)
}

// 容器和宇航员 ref
const containerRef = ref<HTMLElement | null>(null)
const astronautRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const svgLines = ref<{ x1: number; y1: number; x2: number; y2: number; color: string; id: number }[]>([])
const containerSize = ref({ width: 0, height: 0 })

function setCardRef(el: unknown, index: number) {
  if (el) cardRefs.value[index] = el as HTMLElement
}

// 计算连线坐标
function computeLines() {
  if (!containerRef.value || !astronautRef.value) return
  const containerRect = containerRef.value.getBoundingClientRect()
  const astRect = astronautRef.value.getBoundingClientRect()

  containerSize.value = {
    width: containerRect.width,
    height: containerRect.height,
  }

  const cx = astRect.left - containerRect.left + astRect.width / 2
  const cy = astRect.top - containerRect.top + astRect.height / 2
  const radius = astRect.width / 2 + 18 // 线起点离宇航员边缘的距离

  const lines: typeof svgLines.value = []

  cardRefs.value.forEach((cardEl, i) => {
    if (!cardEl) return
    const cardRect = cardEl.getBoundingClientRect()
    const cardCx = cardRect.left - containerRect.left + cardRect.width / 2
    const cardCy = cardRect.top - containerRect.top + cardRect.height / 2

    // 方向向量
    const dx = cardCx - cx
    const dy = cardCy - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return

    // 起点：宇航员圆边上
    const x1 = cx + (dx / dist) * radius
    const y1 = cy + (dy / dist) * radius

    // 终点：卡片最近边
    // 找到卡片上最近的接入点（卡片四条边的中点附近）
    let x2 = cardCx
    let y2 = cardCy
    const halfW = cardRect.width / 2
    const halfH = cardRect.height / 2

    // 使用卡片中心相对宇航员的方向，找对应边上的接触点
    const t = Math.min(Math.abs(halfW / dx), Math.abs(halfH / dy))
    x2 = cardCx - dx * t
    y2 = cardCy - dy * t

    // 确保终点不超出卡片范围
    x2 = Math.max(cardRect.left - containerRect.left + 4, Math.min(cardRect.right - containerRect.left - 4, x2))
    y2 = Math.max(cardRect.top - containerRect.top + 4, Math.min(cardRect.bottom - containerRect.top - 4, y2))

    lines.push({ x1, y1, x2, y2, color: cards[i].color, id: cards[i].id })
  })

  svgLines.value = lines
}

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  await nextTick()
  computeLines()

  resizeObserver = new ResizeObserver(() => {
    computeLines()
  })
  if (containerRef.value) resizeObserver.observe(containerRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

function goToSkills() {
  router.push('/skills')
}

function goToClawhub() {
  window.open('https://clawhub.com', '_blank')
}
</script>

<template>
  <div class="home-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>
    </div>

    <!-- 顶部标题区 -->
    <div class="page-header">
      <h1 class="page-title">Upgrade Path</h1>
      <p class="page-subtitle">人类阵营升级路径</p>
    </div>

    <!-- 思维导图主体 -->
    <div class="mindmap-container" ref="containerRef">
      <!-- SVG 连线层 -->
      <svg class="lines-svg" :width="containerSize.width" :height="containerSize.height">
        <defs>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          v-for="line in svgLines"
          :key="line.id"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#d1d5db"
          stroke-width="0.75"
          stroke-linecap="round"
          opacity="0.5"
          class="connect-line"
        />
      </svg>

      <!-- 宇航员（中心） -->
      <div class="astronaut-wrap" ref="astronautRef">
        <div class="astronaut-core">
          <img
            :src="astronautSrc"
            alt="宇航员"
            class="astronaut-img"
            @load="astronautImgLoaded = true"
            @error="($event.target as HTMLImageElement).style.display='none'"
          />
          <!-- 占位（图片未加载成功时显示） -->
          <div v-if="!astronautImgLoaded" class="astronaut-placeholder">
            <div class="loading-spinner"></div>
          </div>
        </div>
      </div>

      <!-- 8 张卡片 -->
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="(el) => setCardRef(el, index)"
        class="skill-card"
        :class="`card-pos-${index + 1}`"
        :style="{ '--card-color': card.color, '--card-glow': card.glow }"
        @click="goToQuestion(card.tagKey)"
      >
        <div class="card-dot" :style="{ background: card.color }"></div>
        <h3 class="card-title">{{ card.title }}</h3>
        <ul class="card-items">
          <li v-for="(item, i) in card.items" :key="i" class="card-item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="bottom-action">
      <p class="evolution-text">双向进化</p>
      <p class="evolution-subtitle">Agent能做出什么不仅取决于Agent</p>
      <button class="explore-btn" @click="goToSkills">
        <span>探索Humanhub</span>
        <svg class="btn-arrow" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
      </button>
      <button class="explore-btn" @click="goToClawhub">
        <span>探索Clawhub</span>
        <svg class="btn-arrow" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding-bottom: 60px;
}

/* 背景装饰 - 纯黑白极简 */
.bg-decoration {
  display: none;
}

/* 顶部标题 */
.page-header {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 40px 24px 0;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.3px;
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* 思维导图主体容器 */
.mindmap-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  /* 高度设为自适应，由卡片撑开 */
  min-height: 780px;
  padding: 60px 40px 60px;
  box-sizing: border-box;
}

/* SVG 连线层 */
.lines-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

.connect-line {
  animation: lineDraw 1.2s ease both;
}

@keyframes lineDraw {
  from { stroke-dashoffset: 200; opacity: 0; }
  to { stroke-dashoffset: 0; opacity: 0.55; }
}

/* 宇航员中心 */
.astronaut-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.astronaut-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  animation: ringPulse 3s ease-in-out infinite;
}

.ring-outer {
  width: 130px;
  height: 130px;
  animation-delay: 0s;
}

.ring-inner {
  width: 108px;
  height: 108px;
  animation-delay: 0.5s;
  border-color: rgba(0, 0, 0, 0.08);
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.06); opacity: 0.9; }
}

.astronaut-core {
  width: 94px;
  height: 94px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: astronautFloat 6s ease-in-out infinite;
  position: relative;
}

@keyframes astronautFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.astronaut-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.astronaut-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #e5e7eb;
  border-top-color: #9ca3af;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 技能卡片 */
.skill-card {
  position: absolute;
  z-index: 5;
  width: 252px;
  background: #ffffff;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid transparent;
  box-shadow: none;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
  animation: cardAppear 0.6s ease both;
}

.skill-card:hover {
  transform: translateY(-3px) scale(1.015);
  border-color: rgba(0,0,0,0.08);
}

@keyframes cardAppear {
  from { opacity: 0; transform: scale(0.88) translateY(6px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* 各卡片延迟出现 */
.card-pos-1 { animation-delay: 0.1s; }
.card-pos-2 { animation-delay: 0.18s; }
.card-pos-3 { animation-delay: 0.26s; }
.card-pos-4 { animation-delay: 0.34s; }
.card-pos-5 { animation-delay: 0.42s; }
.card-pos-6 { animation-delay: 0.5s; }
.card-pos-7 { animation-delay: 0.58s; }
.card-pos-8 { animation-delay: 0.66s; }

/* 8张卡片的位置布局（围绕中心宇航员分布） */
/* 容器 1200px，宇航员在 50% 50% */
/* 分两列：左4张（right侧约280px），右4张（left侧约280px） */
/* 上下各4张交错排列 */

/* 左侧4张（卡片宽度252px，顶部和底部卡片向中间靠近） */
.card-pos-1 {
  left: calc(50% - 340px);
  top: 60px;
}
.card-pos-2 {
  left: calc(50% - 442px);
  top: 210px;
}
.card-pos-3 {
  left: calc(50% - 442px);
  top: 380px;
}
.card-pos-4 {
  left: calc(50% - 340px);
  top: 540px;
}

/* 右侧4张（顶部和底部卡片向中间靠近） */
.card-pos-5 {
  left: calc(50% + 88px);
  top: 60px;
}
.card-pos-6 {
  left: calc(50% + 185px);
  top: 210px;
}
.card-pos-7 {
  left: calc(50% + 185px);
  top: 380px;
}
.card-pos-8 {
  left: calc(50% + 88px);
  top: 540px;
}

.card-dot {
  display: none;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 8px;
  line-height: 1.4;
  letter-spacing: -0.2px;
}

.card-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-item {
  font-size: 11.5px;
  color: #666666;
  line-height: 1.5;
  padding-left: 10px;
  position: relative;
}

.card-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #000000;
  opacity: 0.2;
}

/* 底部操作 */
.bottom-action {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.evolution-text {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}

.evolution-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 16px;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: transparent;
  color: #4b5563;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
  width: 200px;
}

.explore-btn + .explore-btn {
  margin-top: 16px;
}

.explore-btn:hover {
  color: #6b7280;
  border-color: #d1d5db;
}

.btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.explore-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* 响应式 */
@media (max-width: 900px) {
  .mindmap-container {
    min-height: auto;
    padding: 20px 16px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .lines-svg { display: none; }
  .astronaut-wrap { position: relative; left: auto; top: auto; transform: none; margin-bottom: 24px; }

  .skill-card {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 100%;
    max-width: 360px;
  }
}
</style>
