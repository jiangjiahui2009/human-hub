<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// === 术语数据 ===
const categories: Record<string, { label: string; color: string }> = {
  '核心概念': { label: '核心概念', color: '#2563eb' },
  '交互方式': { label: '交互方式', color: '#7c3aed' },
  'AI 技术': { label: 'AI 技术', color: '#059669' },
  '工程实践': { label: '工程实践', color: '#d97706' },
  '效率技巧': { label: '效率技巧', color: '#dc2626' },
  '数据概念': { label: '数据概念', color: '#0891b2' },
}

const terms: { id: string; label: string; category: string }[] = [
  { id: 'cli', label: '命令 / CLI', category: '交互方式' },
  { id: 'dialogue', label: '对话模式', category: '交互方式' },
  { id: 'slash', label: '斜杠命令', category: '交互方式' },
  { id: 'skill', label: '技能 / Skill', category: '核心概念' },
  { id: 'plugin', label: '插件', category: '核心概念' },
  { id: 'automation', label: '自动化', category: '工程实践' },
  { id: 'workflow', label: '工作流', category: '工程实践' },
  { id: 'rag', label: 'RAG / 检索增强', category: 'AI 技术' },
  { id: 'knowledge', label: '知识库', category: '数据概念' },
  { id: 'multimodal', label: '多模态', category: 'AI 技术' },
  { id: 'prompt', label: '提示词 / Prompt', category: '核心概念' },
  { id: 'technique', label: '技巧', category: '效率技巧' },
  { id: 'advanced', label: '进阶', category: '效率技巧' },
  { id: 'efficiency', label: '效率', category: '效率技巧' },
  { id: 'pitfall', label: '避坑', category: '效率技巧' },
  { id: 'bestpractice', label: '最佳实践', category: '效率技巧' },
  { id: 'hotkey', label: '快捷键', category: '效率技巧' },
  { id: 'batch', label: '批量处理', category: '工程实践' },
  { id: 'template', label: '模板', category: '效率技巧' },
  { id: 'memory', label: '记忆 / 上下文记忆', category: 'AI 技术' },
  { id: 'persona', label: '角色设定', category: '核心概念' },
  { id: 'process', label: '流程化', category: '工程实践' },
  { id: 'finetune', label: '微调', category: 'AI 技术' },
  { id: 'embedding', label: '嵌入', category: '数据概念' },
  { id: 'vector', label: '向量库', category: '数据概念' },
  { id: 'mcp', label: 'MCP', category: '核心概念' },
  { id: 'token', label: 'Token', category: '数据概念' },
  { id: 'hallucination', label: '幻觉微博', category: 'AI 技术' },
  { id: 'multioutput', label: '多输出', category: '工程实践' },
]

const edges: { source: string; target: string }[] = [
  // 核心概念之间
  { source: 'skill', target: 'plugin' },
  { source: 'skill', target: 'mcp' },
  { source: 'skill', target: 'prompt' },
  { source: 'prompt', target: 'persona' },
  { source: 'mcp', target: 'plugin' },

  // 交互方式
  { source: 'cli', target: 'slash' },
  { source: 'cli', target: 'dialogue' },
  { source: 'slash', target: 'skill' },
  { source: 'dialogue', target: 'prompt' },

  // 工程实践
  { source: 'automation', target: 'workflow' },
  { source: 'automation', target: 'batch' },
  { source: 'workflow', target: 'process' },
  { source: 'workflow', target: 'skill' },
  { source: 'batch', target: 'multioutput' },

  // AI 技术
  { source: 'rag', target: 'knowledge' },
  { source: 'rag', target: 'embedding' },
  { source: 'rag', target: 'vector' },
  { source: 'knowledge', target: 'vector' },
  { source: 'embedding', target: 'vector' },
  { source: 'multimodal', target: 'prompt' },
  { source: 'memory', target: 'rag' },
  { source: 'memory', target: 'prompt' },
  { source: 'finetune', target: 'embedding' },
  { source: 'hallucination', target: 'rag' },
  { source: 'hallucination', target: 'prompt' },

  // 效率技巧
  { source: 'technique', target: 'advanced' },
  { source: 'technique', target: 'pitfall' },
  { source: 'bestpractice', target: 'technique' },
  { source: 'efficiency', target: 'hotkey' },
  { source: 'efficiency', target: 'template' },
  { source: 'efficiency', target: 'batch' },
  { source: 'template', target: 'prompt' },
  { source: 'template', target: 'workflow' },

  // 数据概念
  { source: 'token', target: 'prompt' },
  { source: 'token', target: 'memory' },
]

// === Canvas 力导向图谱 ===
const canvasRef = ref<HTMLCanvasElement | null>(null)
const hoveredNode = ref<string | null>(null)
const selectedNode = ref<string | null>(null)
const tooltip = ref({ visible: false, x: 0, y: 0, label: '', category: '' })

interface Node {
  id: string
  label: string
  category: string
  x: number
  y: number
  vx: number
  vy: number
  fx: number | null
  fy: number | null
}

let nodes: Node[] = []
let animId = 0
let dragging: string | null = null
let canvasW = 0
let canvasH = 0

function initGraph() {
  const canvas = canvasRef.value!
  const rect = canvas.parentElement!.getBoundingClientRect()
  canvasW = rect.width
  canvasH = rect.height
  canvas.width = canvasW * devicePixelRatio
  canvas.height = canvasH * devicePixelRatio
  canvas.style.width = canvasW + 'px'
  canvas.style.height = canvasH + 'px'

  // 初始化节点位置（圆形分布）
  nodes = terms.map((t, i) => {
    const angle = (2 * Math.PI * i) / terms.length
    const r = Math.min(canvasW, canvasH) * 0.3
    return {
      id: t.id,
      label: t.label,
      category: t.category,
      x: canvasW / 2 + r * Math.cos(angle),
      y: canvasH / 2 + r * Math.sin(angle),
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }
  })

  simulate()
  draw()
}

function simulate() {
  const repulsion = 3000
  const attraction = 0.005
  const centerForce = 0.01
  const damping = 0.85

  function tick() {
    // 斥力
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x
        const dy = nodes[j].y - nodes[i].y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = repulsion / (dist * dist)
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        nodes[i].vx -= fx
        nodes[i].vy -= fy
        nodes[j].vx += fx
        nodes[j].vy += fy
      }
    }

    // 引力（边）
    for (const edge of edges) {
      const a = nodes.find(n => n.id === edge.source)
      const b = nodes.find(n => n.id === edge.target)
      if (!a || !b) continue
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const idealDist = 120
      const force = (dist - idealDist) * attraction
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx += fx
      a.vy += fy
      b.vx -= fx
      b.vy -= fy
    }

    // 中心引力
    for (const node of nodes) {
      node.vx += (canvasW / 2 - node.x) * centerForce
      node.vy += (canvasH / 2 - node.y) * centerForce
    }

    // 更新位置
    for (const node of nodes) {
      if (node.id === dragging) continue
      if (node.fx !== null) continue
      node.vx *= damping
      node.vy *= damping
      node.x += node.vx
      node.y += node.vy
      // 边界
      node.x = Math.max(60, Math.min(canvasW - 60, node.x))
      node.y = Math.max(30, Math.min(canvasH - 30, node.y))
    }

    draw()
    animId = requestAnimationFrame(tick)
  }

  tick()
}

function draw() {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  const dpr = devicePixelRatio
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, canvasW, canvasH)

  const isHighlighted = (nodeId: string) => {
    if (!hoveredNode.value && !selectedNode.value) return true
    const activeId = hoveredNode.value || selectedNode.value
    if (nodeId === activeId) return true
    return edges.some(
      e => (e.source === activeId && e.target === nodeId) ||
           (e.target === activeId && e.source === nodeId)
    )
  }

  const getEdgeOpacity = (source: string, target: string) => {
    if (!hoveredNode.value && !selectedNode.value) return 0.12
    const activeId = hoveredNode.value || selectedNode.value
    if (source === activeId || target === activeId) return 0.5
    return 0.03
  }

  // 画边
  for (const edge of edges) {
    const a = nodes.find(n => n.id === edge.source)
    const b = nodes.find(n => n.id === edge.target)
    if (!a || !b) continue
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = `rgba(37, 99, 235, ${getEdgeOpacity(edge.source, edge.target)})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // 画节点
  for (const node of nodes) {
    const cat = categories[node.category]
    const color = cat?.color || '#9ca3af'
    const highlighted = isHighlighted(node.id)
    const isActive = node.id === hoveredNode.value || node.id === selectedNode.value

    ctx.globalAlpha = highlighted ? 1 : 0.15

    // 圆点
    const radius = isActive ? 8 : 5
    ctx.beginPath()
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()

    if (isActive) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, 14, 0, 2 * Math.PI)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.25
      ctx.stroke()
      ctx.globalAlpha = highlighted ? 1 : 0.15
    }

    // 文字
    ctx.font = isActive ? '600 13px -apple-system, BlinkMacSystemFont, sans-serif' : '500 12px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = isActive ? '#111827' : '#374151'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 文字在圆点下方
    const textY = node.y + radius + 14
    ctx.fillText(node.label, node.x, textY)

    ctx.globalAlpha = 1
  }
}

function getNodeAt(x: number, y: number): Node | null {
  for (const node of nodes) {
    const dx = node.x - x
    const dy = node.y - y
    if (dx * dx + dy * dy < 400) return node
  }
  return null
}

function getCanvasPos(e: MouseEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onMouseDown(e: MouseEvent) {
  const pos = getCanvasPos(e)
  const node = getNodeAt(pos.x, pos.y)
  if (node) {
    dragging = node.id
    canvasRef.value!.style.cursor = 'grabbing'
  }
}

function onMouseMove(e: MouseEvent) {
  const pos = getCanvasPos(e)

  if (dragging) {
    const node = nodes.find(n => n.id === dragging)
    if (node) {
      node.x = pos.x
      node.y = pos.y
      node.vx = 0
      node.vy = 0
    }
    return
  }

  const node = getNodeAt(pos.x, pos.y)
  const newHovered = node?.id || null
  if (newHovered !== hoveredNode.value) {
    hoveredNode.value = newHovered
    if (node) {
      tooltip.value = {
        visible: true,
        x: e.clientX,
        y: e.clientY,
        label: node.label,
        category: node.category,
      }
      canvasRef.value!.style.cursor = 'pointer'
    } else {
      tooltip.value.visible = false
      canvasRef.value!.style.cursor = 'default'
    }
  }
}

function onMouseUp() {
  dragging = null
  canvasRef.value!.style.cursor = hoveredNode.value ? 'pointer' : 'default'
}

function onClick(e: MouseEvent) {
  const pos = getCanvasPos(e)
  const node = getNodeAt(pos.x, pos.y)
  selectedNode.value = node?.id || null
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  initGraph()
  resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(animId)
    initGraph()
  })
  resizeObserver.observe(canvasRef.value!.parentElement!)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Graph</h1>
      <p class="page-subtitle">HumanHub 全库 RAG 化</p>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <span
        v-for="(cat, key) in categories"
        :key="key"
        class="legend-item"
      >
        <span class="legend-dot" :style="{ background: cat.color }"></span>
        {{ cat.label }}
      </span>
    </div>

    <!-- 图谱画布 -->
    <div class="graph-wrap">
      <canvas
        ref="canvasRef"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @click="onClick"
      />
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltip.visible"
      class="graph-tooltip"
      :style="{ left: tooltip.x + 12 + 'px', top: tooltip.y - 10 + 'px' }"
    >
      <div class="tooltip-label">{{ tooltip.label }}</div>
      <div class="tooltip-cat">{{ tooltip.category }}</div>
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

/* 图例 */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 画布容器 */
.graph-wrap {
  width: 100%;
  height: 560px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
}

canvas {
  display: block;
}

/* Tooltip */
.graph-tooltip {
  position: fixed;
  pointer-events: none;
  z-index: 100;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.tooltip-label {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.tooltip-cat {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}
</style>
