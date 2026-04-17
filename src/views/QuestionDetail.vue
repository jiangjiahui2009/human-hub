<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
// nextTick imported for scroll-to-top functionality
import { useRoute, useRouter } from 'vue-router'
import { useSkillsStore } from '../stores/skills'
import { useAuthStore } from '../stores/auth'
import { type TagKey, isValidTagKey } from '../lib/tags'
import { ArrowLeft, ChevronLeft, List, Check, Star, CheckCircle } from 'lucide-vue-next'
import CommentList from '../components/comment/CommentList.vue'
import CommentForm from '../components/comment/CommentForm.vue'
import type { Skill, Comment } from '../types'

const route = useRoute()
const router = useRouter()
const skillsStore = useSkillsStore()

// 当前选中的 skill
const selectedSkillId = ref<string | null>(null)
const selectedSkill = computed<Skill | null>(() => {
  if (!selectedSkillId.value) return null
  return skillsStore.skills.find(s => s.id === selectedSkillId.value) || null
})

// 问题列表弹窗
const showQuestionMenu = ref(false)

// 评论相关
const auth = useAuthStore()
const comments = ref<Comment[]>([])
const commentsLoading = ref(false)
const commentFormRef = ref<InstanceType<typeof CommentForm> | null>(null)
const isStarred = ref(false)
const isDone = ref(false)
const starLoading = ref(false)

// 加载评论
async function loadComments(skillId: string) {
  if (!skillId) return
  commentsLoading.value = true
  try {
    comments.value = await skillsStore.fetchComments(skillId)
  } finally {
    commentsLoading.value = false
  }
}

// 提交评论
async function submitComment(content: string) {
  if (!selectedSkillId.value || !auth.isLoggedIn || !auth.user) return
  
  const newComment = await skillsStore.addComment(
    selectedSkillId.value,
    auth.user.id,
    auth.user.name,
    auth.user.avatarUrl,
    content
  )
  
  if (newComment) {
    comments.value.unshift(newComment)
    commentFormRef.value?.reset()
  }
}

// 删除评论
async function deleteComment(commentId: string) {
  if (!selectedSkillId.value) return
  const success = await skillsStore.deleteComment(commentId, selectedSkillId.value)
  if (success) {
    comments.value = comments.value.filter(c => c.id !== commentId)
  }
}

// 监听 skill 变化，加载评论
watch(selectedSkillId, (skillId) => {
  if (skillId) {
    loadComments(skillId)
  } else {
    comments.value = []
  }
})

// 8 个问题列表
const questionList = [
  { key: 'generate_ideas', title: '如何产生项目点子？' },
  { key: 'optimize_expression', title: '如何逐步表达清楚需求？' },
  { key: 'unlock_agent', title: '如何让 Agent 发挥最佳水平？' },
  { key: 'reduce_rework', title: '如何减少返工？' },
  { key: 'bug_fix', title: '如何更高效率修改 Bug？' },
  { key: 'token_usage', title: '如何优化 Token 消耗？' },
  { key: 'production', title: '如何让 AI 开发的产品更稳定成熟？' },
  { key: 'multi_agent', title: '如何让 Agent 持续不间断工作？' },
] as const

// 获取当前标签 key
const tagKey = computed<TagKey | null>(() => {
  const key = route.params.tagKey as string
  return isValidTagKey(key) ? key : null
})

// 问题详细信息
const questionInfo = computed(() => {
  if (!tagKey.value) return null

  const infoMap: Record<TagKey, {
    title: string
    description: string
    related: string[]
    scenarios: string[]
    reasons: string[]
  }> = {
    generate_ideas: {
      title: '如何产生项目点子？',
      description: '熟悉工具用法，但没有明确目标，纯为了玩工具而造项目，点子无价值；人类不知道 AI 能做什么。',
      related: [
        '如何知道解决什么问题？',
        '知道工具的能力，能做什么？',
      ],
      scenarios: [],
      reasons: [
        '熟悉工具用法，但没有明确目标，纯为了玩工具而造项目，点子无价值；',
        '人类不知道 AI 能做什么',
      ],
    },
    optimize_expression: {
      title: '如何逐步表达清楚需求？',
      description: '人类初始需求本身的天然模糊性、感性、碎片化、非结构化；人类在交流过程中，难以表达出来「意会需求」。',
      related: [
        '如何逐步表达，靠近最终目标？',
        '如何从模糊需求，变成精准需求，再到产品方案？',
        '很难完成多轮对话，因为会遇到困难？',
      ],
      scenarios: [
        '需求阶段、方案阶段、设计阶段、研发阶段',
      ],
      reasons: [
        '人类初始需求本身的天然模糊性、感性、碎片化、非结构化；',
        '人类在交流过程中，难以表达出来「意会需求」，就像说做一个酷炫的设计；',
        '人类不知道该如何拆解模糊目标；',
        '人类不知道自己不知道什么，以及不知道 AI 原来可以这样；',
        '人类不知道该怎么一步步引导 AI，或是说，不会「追问」、不会给「反馈」或「修正方向」、不知道怎么矫正；',
      ],
    },
    unlock_agent: {
      title: '如何让 Agent 发挥最佳水平？',
      description: 'AI 大模型、hardness 原生能力天花板；AI 没有借用现有经验、Skill 来实现需求；人类不知道如何调整 Agent 执行策略、思考强度、记忆长度、以及解锁多 Agent 编排等。',
      related: [
        '如何让 AI 最快找到最佳路径和方法？',
        '如何让 AI 少做无用的试错？',
        '如何人为干预最小化？',
        '如何解决一些具体问题：比如长程记忆缺陷、权限干预等？',
      ],
      scenarios: [
        '需求阶段、方案阶段、设计阶段、研发阶段、生产环境稳定运行场景',
      ],
      reasons: [
        'AI 大模型、hardness 原生能力天花板；',
        'AI 没有借用现有经验、Skill 来实现需求；',
        '人类不知道如何调整 Agent 执行策略、思考强度、记忆长度、以及解锁多 Agent 编排等；',
      ],
    },
    reduce_rework: {
      title: '如何减少返工？',
      description: 'AI 大模型、hardness 原生能力天花板；需求从模糊到清晰的过程，带来的返工；需求的变更，带来的返工；人类不知道更好的管理需求。',
      related: [
        '如何减少设计阶段返工？',
        '如何减少研发阶段返工？',
        '如何让 AI 不擅自加戏、不做无关内容？',
      ],
      scenarios: [
        '需求阶段、方案阶段、设计阶段、研发阶段、迭代阶段',
      ],
      reasons: [
        'AI 大模型、hardness 原生能力天花板；',
        '需求从模糊到清晰的过程，带来的返工；',
        '需求的变更，带来的返工；',
        '人类不知道更好的管理需求，比如需求基线管理，边界管理，输出要求管理，检查点机制等；',
      ],
    },
    bug_fix: {
      title: '如何更高效率修改 Bug？',
      description: '在 AI 辅助研发与调试场景中，期望快速定位并修复问题，同时从根源优化代码质量与安全，减少 bug 产生与重复修复，实现高效闭环调试。',
      related: [
        '如何让 AI 更快的改好 bug？',
        '如何优化调试效率？',
        '在 AI 辅助研发与调试场景中，期望快速定位并修复问题，同时从根源优化代码质量与安全，减少 bug 产生与重复修复，实现高效闭环调试。',
      ],
      scenarios: [
        'Agent 自动化开发、代码联调、线上 bug 应急修复',
      ],
      reasons: [],
    },
    token_usage: {
      title: '如何优化 Token 消耗？',
      description: '剔除所有无效 Token 消耗，用最小成本实现 AI 精准输出，平衡效率、效果与成本。',
      related: [
        '如何用小成本完成目标？',
        '剔除所有无效 Token 消耗，用最小成本实现 AI 精准输出，平衡效率、效果与成本。',
      ],
      scenarios: [
        '全场景',
      ],
      reasons: [
        '上下文严重冗余；',
        '信息传输方式错误：全量而非增量，每次修改 / 提问都重新传输完整代码、完整需求，而非仅传「变更片段」。',
      ],
    },
    production: {
      title: '如何让 AI 开发的产品更稳定成熟？',
      description: '人类不知道稳定性要求，及包括生产环境约束并发量、部署方式、兼容性、安全规范等；Vibe coding 原生特性，重速度轻工程化。',
      related: [
        '如何做版本管理与迭代？',
        '如何 Vibe code 产物活过生产环境？',
      ],
      scenarios: [
        '全场景',
      ],
      reasons: [
        '人类不知道稳定性要求，及包括生产环境约束并发量、部署方式、兼容性、安全规范等；',
        'Vibe coding 原生特性，重速度轻工程化，如 AI 生成代码普遍缺少：入参校验、异常捕获、日志打印、监控埋点、熔断限流、数据库事务、安全防护，无法应对生产环境的复杂场景；',
        '人类未提出版本管理体系，造成代码无秩序、无退路；',
      ],
    },
    multi_agent: {
      title: '如何让 Agent 持续不间断工作？',
      description: '人类不知道让 AI 做什么任务，可以持续让他释放效能；人类不知道如何实现任务编排，以及哪些任务可以实现编排；大量执行 Agent 无序运行，需要人工逐个调度，无法实现集群化自治。',
      related: [
        '如何让 OpenClaw 无人值守稳定跑满 24 小时以上？',
        '如何让 Agent 管理 Agent？',
        '如何让多 Agent 协作时互不干扰记忆？',
        '如何让多 Agent 分工明确不重复执行任务？',
        'Agent 长效稳定、OpenClaw 生产级部署、无人值守自愈，从「单次运行」到「7×24 小时持续服务」；',
      ],
      scenarios: [
        '全场景',
      ],
      reasons: [
        '人类不知道让 AI 做什么任务，可以持续让他释放效能；',
        '人类不知道如何实现任务编排，以及哪些任务可以实现编排；',
        '大量执行 Agent 无序运行，需要人工逐个调度，无法实现集群化自治；',
        '无角色划分，研发 Agent、测试 Agent、调试 Agent 职能交叉；',
        '部分 Agent 超负荷卡死，部分 Agent 闲置空转，集群效能无法释放。',
        '只有执行思维，没有管理思维。只会自己动手做，不会拆分任务、设定节点、校验结果，缺乏管理者的「管控视角」，事必躬亲无法并行；',
        '无检查机制，任务无闭环。只启动任务，不设置检查点、不追踪进度、不验收结果，任务处于「放养状态」，自然失控；',
        '天生单线程思维，无统筹框架。大多数人习惯一次只做一件事，大脑没有形成「调度中心」，多任务同时推进就认知过载、混乱崩溃；',
      ],
    },
  }

  return infoMap[tagKey.value]
})

// 关联的 skills（按标签筛选，未 Done 的）
const relatedSkills = computed(() => {
  if (!tagKey.value) return []
  return skillsStore.skills.filter(skill => 
    skill.tags?.includes(tagKey.value!) && !skillsStore.myDoneIds.has(skill.id)
  )
})

// 已 Done 的 skills
const doneSkills = computed(() => {
  if (!tagKey.value) return []
  return skillsStore.skills.filter(skill => 
    skill.tags?.includes(tagKey.value!) && skillsStore.myDoneIds.has(skill.id)
  )
})

// 是否展开已 Done 的 skills
const showDoneSkills = ref(false)

// 移动端视图状态：'list' | 'detail'
const mobileView = ref<'list' | 'detail'>('list')

// 选择 skill
function selectSkill(skillId: string) {
  selectedSkillId.value = skillId
  // 同步到 URL query
  router.replace({ query: { ...route.query, skill: skillId } })
  // 移动端切换到详情视图
  if (window.innerWidth < 768) {
    mobileView.value = 'detail'
  }
  // 桌面端：滚动右栏到顶部
  if (window.innerWidth >= 768) {
    nextTick(() => {
      const rightPanel = document.querySelector('.right-panel')
      if (rightPanel) {
        rightPanel.scrollTop = 0
      }
    })
  }
}

// 返回列表（移动端）
function backToList() {
  mobileView.value = 'list'
}

// 返回首页
function goBack() {
  router.push('/')
}

// 切换到其他问题
function switchQuestion(key: TagKey) {
  showQuestionMenu.value = false
  router.push(`/question/${key}`)
}

onMounted(() => {
  // 确保 skills 数据已加载
  if (skillsStore.skills.length === 0) {
    skillsStore.fetchSkills().then(() => {
      initSelectedSkill()
    })
  } else {
    initSelectedSkill()
  }
})

// 初始化选中 skill
function initSelectedSkill() {
  // 优先从 URL query 获取
  const skillFromQuery = route.query.skill as string
  if (skillFromQuery && relatedSkills.value.find(s => s.id === skillFromQuery)) {
    selectedSkillId.value = skillFromQuery
    return
  }
  // 默认选中第一个
  if (relatedSkills.value.length > 0) {
    selectedSkillId.value = relatedSkills.value[0].id
  }
}

// 监听 skills 变化（异步加载完成后）
watch(relatedSkills, (skills) => {
  if (skills.length > 0 && !selectedSkillId.value) {
    selectedSkillId.value = skills[0].id
  }
})

// 监听问题切换，重置选中 skill
watch(tagKey, () => {
  selectedSkillId.value = null
  initSelectedSkill()
})

// 收藏/取消收藏
async function toggleStar() {
  if (!auth.isLoggedIn) {
    auth.loginWithGitHub()
    return
  }
  if (!selectedSkill.value) return
  starLoading.value = true
  const newStarred = await skillsStore.toggleStar(selectedSkill.value.id, auth.user!.id)
  isStarred.value = newStarred
  starLoading.value = false
}

// Done - 收入盒子
async function handleDone() {
  if (!selectedSkill.value || !auth.isLoggedIn || !auth.user) return
  const newDone = await skillsStore.toggleDone(selectedSkill.value.id, auth.user.id)
  isDone.value = newDone
  // 简单提示，不跳转（因为是右侧详情面板）
  if (newDone) {
    // 如果当前 skill 被 done，自动选中下一个
    const currentIndex = relatedSkills.value.findIndex(s => s.id === selectedSkill.value!.id)
    const nextSkill = relatedSkills.value[currentIndex + 1] || relatedSkills.value[currentIndex - 1]
    if (nextSkill) {
      selectSkill(nextSkill.id)
    }
  }
}

// 监听 skill 变化，更新收藏和 done 状态
watch(selectedSkillId, async (skillId) => {
  if (skillId && auth.isLoggedIn) {
    isStarred.value = skillsStore.myStarredIds.has(skillId)
    isDone.value = skillsStore.myDoneIds.has(skillId)
  } else {
    isStarred.value = false
  }
})
</script>

<template>
  <div class="question-detail-page">
    <!-- 桌面端：三栏内容 -->
    <div class="desktop-layout">
      <!-- 三栏内容区 -->
      <div class="content-area">
      <!-- 左栏：问题详情 -->
      <aside class="left-panel">
        <div class="panel-header">
          <div class="header-actions">
            <button class="back-icon-btn" @click="goBack" title="返回首页">
              <ArrowLeft :size="16" />
            </button>
            <div class="question-menu-wrapper">
              <button 
                class="back-icon-btn" 
                :class="{ active: showQuestionMenu }"
                @click="showQuestionMenu = !showQuestionMenu" 
                title="问题列表"
              >
                <List :size="16" />
              </button>
              <!-- 问题列表弹窗 -->
              <div v-if="showQuestionMenu" class="question-menu">
                <div 
                  v-for="q in questionList" 
                  :key="q.key"
                  class="question-menu-item"
                  :class="{ active: tagKey === q.key }"
                  @click="switchQuestion(q.key)"
                >
                  <span class="question-title">{{ q.title }}</span>
                  <Check v-if="tagKey === q.key" :size="14" class="check-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="questionInfo" class="question-content">
          <h1 class="question-title">{{ questionInfo.title }}</h1>
          <p class="question-desc">{{ questionInfo.description }}</p>

          <!-- 关联问题 -->
          <div v-if="questionInfo.related.length > 0" class="info-section">
            <h3 class="info-title">关联问题</h3>
            <ul class="info-list">
              <li v-for="(item, index) in questionInfo.related" :key="index">{{ item }}</li>
            </ul>
          </div>

          <!-- 适用场景 -->
          <div v-if="questionInfo.scenarios.length > 0" class="info-section">
            <h3 class="info-title">适用场景</h3>
            <ul class="info-list">
              <li v-for="(item, index) in questionInfo.scenarios" :key="index">{{ item }}</li>
            </ul>
          </div>

          <!-- 原因描述 -->
          <div v-if="questionInfo.reasons.length > 0" class="info-section">
            <h3 class="info-title">原因描述</h3>
            <ul class="info-list">
              <li v-for="(item, index) in questionInfo.reasons" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>

        <div v-else class="invalid-tag">
          <p>无效的问题标签</p>
        </div>
      </aside>

      <!-- 中栏：Skill 列表 -->
      <aside class="middle-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            关联技能
            <span class="count">({{ relatedSkills.length }})</span>
          </h2>
        </div>

        <div class="skills-list">
          <!-- 未 Done 的 Skills -->
          <div
            v-for="skill in relatedSkills"
            :key="skill.id"
            class="skill-item"
            :class="{ active: selectedSkillId === skill.id }"
            @click="selectSkill(skill.id)"
          >
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-summary">{{ skill.summary }}</div>
          </div>

          <!-- 展开线：显示已 Done 的 Skills -->
          <div 
            v-if="doneSkills.length > 0" 
            class="done-divider"
            @click="showDoneSkills = !showDoneSkills"
          >
            <span class="divider-line"></span>
            <span class="divider-text">
              {{ showDoneSkills ? '收起已完成' : `显示 ${doneSkills.length} 个已完成` }}
            </span>
            <span class="divider-line"></span>
          </div>

          <!-- 已 Done 的 Skills（可折叠） -->
          <template v-if="showDoneSkills">
            <div
              v-for="skill in doneSkills"
              :key="skill.id"
              class="skill-item done"
              :class="{ active: selectedSkillId === skill.id }"
              @click="selectSkill(skill.id)"
            >
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-summary">{{ skill.summary }}</div>
            </div>
          </template>

          <div v-if="relatedSkills.length === 0 && doneSkills.length === 0" class="empty-state">
            <p>暂无关联技能</p>
          </div>
        </div>
      </aside>

      <!-- 右栏：Skill 详情 -->
      <main class="right-panel">
        <div v-if="selectedSkill" class="skill-detail">
          <!-- 头部 -->
          <div class="detail-header">
            <div class="header-main">
              <h2 class="skill-title">{{ selectedSkill.name }}</h2>
            </div>
            <p class="skill-summary">{{ selectedSkill.summary }}</p>
            <div class="skill-meta">
              <span class="author">@{{ selectedSkill.authorName }}</span>
              <span class="divider">·</span>
              <span class="stats">{{ selectedSkill.starsCount }} 收藏</span>
            </div>
          </div>

          <!-- 内容区 -->
          <div class="detail-content">
            <div class="content-section">
              <h3 class="section-title">使用说明</h3>
              <div class="section-body">{{ selectedSkill.description || '暂无使用说明' }}</div>
            </div>

            <div v-if="selectedSkill.caseExample" class="content-section">
              <h3 class="section-title">案例说明</h3>
              <div class="section-body">{{ selectedSkill.caseExample }}</div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="content-actions-icons">
            <button
              class="icon-btn"
              :class="{ active: isStarred }"
              :disabled="starLoading"
              @click="toggleStar"
              title="收藏"
            >
              <Star :size="16" :fill="isStarred ? 'currentColor' : 'none'" />
            </button>
            <button
              class="icon-btn"
              :class="{ active: isDone }"
              @click="handleDone"
              title="Done.不再展示此技能"
            >
              <CheckCircle :size="16" :fill="isDone ? 'currentColor' : 'none'" />
            </button>
          </div>

          <!-- 评论区域 -->
          <div class="comments-section">
            <h3 class="comments-title">
              评论
              <span class="comments-count">({{ comments.length }})</span>
            </h3>

            <!-- 评论列表 -->
            <div v-if="commentsLoading" class="comments-loading">
              加载中...
            </div>
            <CommentList
              v-else
              :comments="comments"
              :current-user-id="auth.user?.id"
              @delete="deleteComment"
            />

            <!-- 评论表单 -->
            <div class="comment-form-wrapper">
              <CommentForm
                v-if="auth.isLoggedIn"
                ref="commentFormRef"
                @submit="submitComment"
              />
              <div v-else class="login-to-comment">
                <button class="login-link" @click="auth.loginWithGitHub()">
                  登录后即可发表评论
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-detail">
          <p>请选择一个技能查看详情</p>
        </div>
      </main>
      </div><!-- /content-area -->
    </div><!-- /desktop-layout -->

    <!-- 移动端单栏布局 -->
    <div class="mobile-layout">
      <!-- 列表视图 -->
      <div v-if="mobileView === 'list'" class="mobile-list">
        <div class="mobile-header">
          <button class="back-btn" @click="goBack">
            <ArrowLeft class="back-icon" />
          </button>
          <h1 class="mobile-title">{{ questionInfo?.title || '问题详情' }}</h1>
        </div>

        <div class="mobile-question-summary">
          <p>{{ questionInfo?.description }}</p>
        </div>

        <div class="mobile-skills">
          <h2 class="mobile-section-title">关联技能 ({{ relatedSkills.length }})</h2>
          <div
            v-for="skill in relatedSkills"
            :key="skill.id"
            class="mobile-skill-item"
            @click="selectSkill(skill.id)"
          >
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-summary">{{ skill.summary }}</div>
            <ChevronLeft class="arrow-icon" />
          </div>
        </div>
      </div>

      <!-- 详情视图 -->
      <div v-else class="mobile-detail">
        <div class="mobile-header">
          <button class="back-btn" @click="backToList">
            <ChevronLeft class="back-icon" />
            <span>返回列表</span>
          </button>
        </div>

        <div v-if="selectedSkill" class="mobile-detail-content">
          <h1 class="mobile-detail-title">{{ selectedSkill.name }}</h1>
          <p class="mobile-detail-summary">{{ selectedSkill.summary }}</p>

          <div class="mobile-detail-section">
            <h3>使用说明</h3>
            <p>{{ selectedSkill.description || '暂无使用说明' }}</p>
          </div>

          <div v-if="selectedSkill.caseExample" class="mobile-detail-section">
            <h3>案例说明</h3>
            <p>{{ selectedSkill.caseExample }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-detail-page {
  min-height: 100vh;
  background: #fafafa;
}

/* ===== 桌面端：左侧导航 + 三栏内容 ===== */
.desktop-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 三栏内容区 */
.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左栏：问题详情 */
.left-panel {
  width: 300px;
  min-width: 300px;
  background: #f5f5f5;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.back-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.back-icon-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.back-icon-btn.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

/* 头部操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 问题菜单 */
.question-menu-wrapper {
  position: relative;
}

.question-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 240px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 6px;
}

.question-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.question-menu-item:hover {
  background: #f5f5f5;
}

.question-menu-item.active {
  background: #eff6ff;
}

.question-menu-item .question-title {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

.question-menu-item.active .question-title {
  color: #2563eb;
  font-weight: 500;
}

.question-menu-item .check-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.back-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.back-icon {
  width: 14px;
  height: 14px;
}

.question-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.question-title {
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px;
  line-height: 1.4;
}

.question-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px;
}

.info-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.info-title {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-list {
  margin: 0;
  padding-left: 16px;
  list-style-type: disc;
}

.info-list li {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 4px;
}

.invalid-tag {
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}

/* 中栏：Skill 列表 */
.middle-panel {
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.panel-title .count {
  font-weight: 400;
  color: #9ca3af;
}

.skills-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.skill-item {
  padding: 9px 12px;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 8px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.skill-item:hover {
  background: #f5f5f5;
  border-color: #e5e7eb;
}

.skill-item.active {
  background: #f5f5f5;
  border-color: rgba(37, 99, 235, 0.5);
  box-shadow: 0 0 0 0.5px rgba(37, 99, 235, 0.5);
}

.skill-item .skill-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.4;
}

.skill-item .skill-summary {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-item.active .skill-name {
  color: #2563eb;
}

/* 已 Done 的 Skill 样式 */
.skill-item.done {
  opacity: 0.6;
}

.skill-item.done .skill-name {
  text-decoration: line-through;
  color: #9ca3af;
}

.skill-item.done:hover {
  opacity: 0.8;
}

/* 展开线样式 */
.done-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  cursor: pointer;
  user-select: none;
}

.done-divider:hover .divider-text {
  color: #2563eb;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
  transition: color 0.15s ease;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}

/* 右栏：Skill 详情 */
.right-panel {
  flex: 1;
  background: #fff;
  overflow-y: auto;
  padding: 0;
}

.skill-detail {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 40px;
}

.detail-header {
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 24px;
}

.header-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.skill-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

/* 版本号样式已移除 */

.skill-summary {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 16px;
}

.skill-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9ca3af;
}

.skill-meta .divider {
  color: #d1d5db;
}

.detail-content {
  margin-bottom: 32px;
}

.content-section {
  margin-bottom: 28px;
}

.content-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-body {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;
  white-space: pre-wrap;
}

.detail-footer {
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.view-full-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.view-full-btn:hover {
  background: #1d4ed8;
}

/* 评论区域 */
.comments-section {
  margin-top: 0;
  padding-top: 32px;
  border-top: 1px solid #f3f4f6;
}

/* 内容区操作按钮 */
.content-actions-icons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.icon-btn.active {
  color: #f59e0b;
  background: #fffbeb;
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comments-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.comments-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}

.comments-loading {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}

.comment-form-wrapper {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.login-to-comment {
  padding: 16px;
  text-align: center;
  background: #f9fafb;
  border-radius: 8px;
}

.login-link {
  font-size: 13px;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.login-link:hover {
  color: #1d4ed8;
}

.empty-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 14px;
}

/* ===== 移动端单栏布局 ===== */
.mobile-layout {
  display: none;
}

@media (max-width: 1024px) {
  .desktop-layout {
    display: none;
  }

  .mobile-layout {
    display: block;
    min-height: 100vh;
    background: #fff;
  }

  .mobile-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .mobile-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-question-summary {
    padding: 16px;
    background: #fafafa;
    border-bottom: 1px solid #f3f4f6;
  }

  .mobile-question-summary p {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mobile-skills {
    padding: 16px;
  }

  .mobile-section-title {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 12px;
  }

  .mobile-skill-item {
    padding: 14px 16px;
    background: #fff;
    border: 1px solid #f3f4f6;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;
  }

  .mobile-skill-item:hover {
    border-color: #e5e7eb;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .mobile-skill-item .skill-name {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 6px;
    padding-right: 24px;
  }

  .mobile-skill-item .skill-summary {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mobile-skill-item .arrow-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
    width: 18px;
    height: 18px;
    color: #9ca3af;
  }

  /* 移动端详情 */
  .mobile-detail {
    min-height: 100vh;
    background: #fff;
  }

  .mobile-detail-content {
    padding: 20px 16px;
  }

  .mobile-detail-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px;
    line-height: 1.3;
  }

  .mobile-detail-summary {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0 0 24px;
  }

  .mobile-detail-section {
    margin-bottom: 24px;
  }

  .mobile-detail-section h3 {
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mobile-detail-section p {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.8;
    margin: 0;
    white-space: pre-wrap;
  }

  .mobile-detail .view-full-btn {
    width: 100%;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
