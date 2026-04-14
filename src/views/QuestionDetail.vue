<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSkillsStore } from '../stores/skills'
import { type TagKey, isValidTagKey } from '../lib/tags'
import SkillCard from '../components/skill/SkillCard.vue'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const skillsStore = useSkillsStore()

// 获取当前标签 key
const tagKey = computed<TagKey | null>(() => {
  const key = route.params.tagKey as string
  return isValidTagKey(key) ? key : null
})

// 标签中文名和颜色
// 如需使用可从 TAG_LABELS/TAG_COLORS 获取

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
        '如何 Vibe coding 出来的产品活过生产环境？',
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

// 关联的 skills（按标签筛选）
const relatedSkills = computed(() => {
  if (!tagKey.value) return []
  return skillsStore.skills.filter(skill => 
    skill.tags?.includes(tagKey.value!)
  )
})

// 返回首页
function goBack() {
  router.push('/')
}

// 跳转到 skill 详情
function goToSkill(skillId: string) {
  router.push(`/skill/${skillId}`)
}

onMounted(() => {
  // 确保 skills 数据已加载
  if (skillsStore.skills.length === 0) {
    skillsStore.fetchSkills()
  }
})
</script>

<template>
  <div class="question-detail-page">
    <!-- 返回按钮 -->
    <div class="back-nav">
      <button class="back-btn" @click="goBack">
        <ArrowLeft class="back-icon" />
        <span>返回首页</span>
      </button>
    </div>

    <!-- 问题说明区域 -->
    <div v-if="questionInfo" class="question-header">
      <h1 class="question-title">{{ questionInfo.title }}</h1>

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

    <!-- 无效标签提示 -->
    <div v-else class="invalid-tag">
      <p>无效的问题标签</p>
      <button class="back-btn" @click="goBack">返回首页</button>
    </div>

    <!-- 关联 Skills 区域 -->
    <div v-if="tagKey" class="skills-section">
      <div class="section-header">
        <h2 class="section-title">
          关联技能
          <span class="skills-count">({{ relatedSkills.length }})</span>
        </h2>
      </div>

      <!-- Skills 列表 -->
      <div v-if="relatedSkills.length > 0" class="skills-list">
        <SkillCard
          v-for="skill in relatedSkills"
          :key="skill.id"
          :skill="skill"
          @click="goToSkill(skill.id)"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <p>暂无关联技能</p>
        <span class="empty-hint">该标签下的技能正在筹备中，敬请期待</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-detail-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

/* 返回导航 */
.back-nav {
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.back-icon {
  width: 16px;
  height: 16px;
}

/* 问题头部 */
.question-header {
  padding: 32px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #f3f4f6;
  margin-bottom: 32px;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid;
  margin-bottom: 16px;
}

.tag-icon {
  width: 14px;
  height: 14px;
}

.question-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px;
  line-height: 1.3;
}

.question-desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 24px;
}

/* 信息区块 */
.info-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.info-section:first-of-type {
  margin-top: 24px;
}

.info-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-list {
  margin: 0;
  padding-left: 18px;
  list-style-type: disc;
}

.info-list li {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 4px;
}

.info-list li:last-child {
  margin-bottom: 0;
}

/* 无效标签 */
.invalid-tag {
  text-align: center;
  padding: 60px 24px;
  color: #6b7280;
}

.invalid-tag p {
  margin-bottom: 16px;
}

/* Skills 区域 */
.skills-section {
  padding: 0 8px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.skills-count {
  font-size: 14px;
  font-weight: 400;
  color: #9ca3af;
}

/* Skills 列表 */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e7eb;
}

.empty-state p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 8px;
}

.empty-hint {
  font-size: 13px;
  color: #9ca3af;
}

/* 响应式 */
@media (max-width: 640px) {
  .question-detail-page {
    padding: 16px;
  }

  .question-header {
    padding: 24px;
  }

  .question-title {
    font-size: 20px;
  }

  .question-desc {
    font-size: 14px;
  }
}
</style>
