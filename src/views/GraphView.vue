<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// === 10 个主题定义 ===
const themes = [
  { id: 't1', label: '稳定性 & 运行可靠性', color: '#2563eb' },
  { id: 't2', label: 'Token & 成本相关', color: '#7c3aed' },
  { id: 't3', label: '生成质量 & 效果一致性', color: '#059669' },
  { id: 't4', label: '产物管理 & 持久化', color: '#d97706' },
  { id: 't5', label: 'Agent & 多角色协同', color: '#dc2626' },
  { id: 't6', label: '交互与操作体验', color: '#0891b2' },
  { id: 't7', label: '调试、日志与监控', color: '#7c2d12' },
  { id: 't8', label: '兼容性与集成', color: '#4338ca' },
  { id: 't9', label: '安全、权限与治理', color: '#be123c' },
  { id: 't10', label: '效率、迭代与扩展', color: '#047857' },
]

// === 100 个小问题 ===
const questions: { id: string; label: string; themeId: string }[] = [
  // t1: 稳定性 & 运行可靠性
  { id: 'q1-1', label: '如何避免 Vibe Coding 产物在生产环境崩溃？', themeId: 't1' },
  { id: 'q1-2', label: '运行时错误监控和兜底机制怎么做？', themeId: 't1' },
  { id: 'q1-3', label: 'AI 生成的代码如何确保边界情况处理完善？', themeId: 't1' },
  { id: 'q1-4', label: '依赖版本冲突或 API 变更如何自动检测？', themeId: 't1' },
  { id: 'q1-5', label: '长时运行任务（如批处理）如何防止中断？', themeId: 't1' },
  { id: 'q1-6', label: '并发请求或高负载下如何保持稳定性？', themeId: 't1' },
  { id: 'q1-7', label: 'AI 产物的资源泄漏（内存、连接）如何预防？', themeId: 't1' },
  { id: 'q1-8', label: '第三方服务（LLM API、数据库）故障如何降级？', themeId: 't1' },
  { id: 'q1-9', label: '如何设计熔断和重试机制？', themeId: 't1' },
  { id: 'q1-10', label: 'AI 生成配置文件的合法性校验怎么做？', themeId: 't1' },

  // t2: Token & 成本相关
  { id: 'q2-1', label: '如何估算和控制单次请求的 Token 消耗？', themeId: 't2' },
  { id: 'q2-2', label: '长对话上下文如何压缩以减少 Token？', themeId: 't2' },
  { id: 'q2-3', label: '多轮迭代中如何避免重复计算 Token？', themeId: 't2' },
  { id: 'q2-4', label: '不同模型（GPT-4/Claude/Gemini）成本如何对比？', themeId: 't2' },
  { id: 'q2-5', label: '批量任务如何优化以降低整体 Token 成本？', themeId: 't2' },
  { id: 'q2-6', label: '如何设置 Token 使用上限和告警？', themeId: 't2' },
  { id: 'q2-7', label: '缓存机制如何减少重复请求的 Token 消耗？', themeId: 't2' },
  { id: 'q2-8', label: 'Prompt 优化能减少多少 Token？如何量化？', themeId: 't2' },
  { id: 'q2-9', label: '流式输出 vs 一次性输出，成本差异多大？', themeId: 't2' },
  { id: 'q2-10', label: '如何预测月度/年度 AI 调用成本？', themeId: 't2' },

  // t3: 生成质量 & 效果一致性
  { id: 'q3-1', label: '如何让 AI 多次生成结果保持一致？', themeId: 't3' },
  { id: 'q3-2', label: 'Temperature 和 Top-p 参数如何调优？', themeId: 't3' },
  { id: 'q3-3', label: '复杂逻辑代码如何确保生成正确性？', themeId: 't3' },
  { id: 'q3-4', label: 'AI 生成内容的风格如何统一？', themeId: 't3' },
  { id: 'q3-5', label: '如何自动评估生成代码的质量？', themeId: 't3' },
  { id: 'q3-6', label: '幻觉问题（Hallucination）如何检测和修正？', themeId: 't3' },
  { id: 'q3-7', label: '长文本生成如何保持上下文连贯？', themeId: 't3' },
  { id: 'q3-8', label: '不同模型输出质量差异如何权衡？', themeId: 't3' },
  { id: 'q3-9', label: 'Few-shot 示例如何设计效果最好？', themeId: 't3' },
  { id: 'q3-10', label: '如何建立生成质量的反馈闭环？', themeId: 't3' },

  // t4: 产物管理 & 持久化
  { id: 'q4-1', label: 'AI 生成的代码如何版本管理？', themeId: 't4' },
  { id: 'q4-2', label: '生成的配置文件如何与环境分离？', themeId: 't4' },
  { id: 'q4-3', label: '如何追踪每次生成的 Prompt 和参数？', themeId: 't4' },
  { id: 'q4-4', label: '生成产物的元数据如何存储？', themeId: 't4' },
  { id: 'q4-5', label: '如何回滚到之前的生成版本？', themeId: 't4' },
  { id: 'q4-6', label: '生成的文档如何自动同步更新？', themeId: 't4' },
  { id: 'q4-7', label: '多环境（dev/staging/prod）产物如何管理？', themeId: 't4' },
  { id: 'q4-8', label: '生成产物的依赖关系如何追踪？', themeId: 't4' },
  { id: 'q4-9', label: '如何清理过期或无用的生成产物？', themeId: 't4' },
  { id: 'q4-10', label: '生成产物的审计日志如何设计？', themeId: 't4' },

  // t5: Agent & 多角色协同
  { id: 'q5-1', label: '多个 Agent 如何分工协作？', themeId: 't5' },
  { id: 'q5-2', label: 'Agent 之间的通信协议如何设计？', themeId: 't5' },
  { id: 'q5-3', label: '如何避免 Agent 循环调用或死锁？', themeId: 't5' },
  { id: 'q5-4', label: '不同角色的 Prompt 如何隔离管理？', themeId: 't5' },
  { id: 'q5-5', label: 'Agent 的状态如何共享和同步？', themeId: 't5' },
  { id: 'q5-6', label: '如何设计 Agent 的权限边界？', themeId: 't5' },
  { id: 'q5-7', label: '多 Agent 系统的错误如何定位？', themeId: 't5' },
  { id: 'q5-8', label: 'Agent 的调用链路如何可视化？', themeId: 't5' },
  { id: 'q5-9', label: '如何评估多 Agent 系统的整体效果？', themeId: 't5' },
  { id: 'q5-10', label: 'Agent 的负载均衡如何设计？', themeId: 't5' },

  // t6: 交互与操作体验
  { id: 'q6-1', label: '如何设计高效的 AI 对话流程？', themeId: 't6' },
  { id: 'q6-2', label: '斜杠命令和快捷键如何设计？', themeId: 't6' },
  { id: 'q6-3', label: '长输出如何分页或折叠展示？', themeId: 't6' },
  { id: 'q6-4', label: '流式输出的视觉反馈如何设计？', themeId: 't6' },
  { id: 'q6-5', label: '如何支持多模态输入（图片、文件）？', themeId: 't6' },
  { id: 'q6-6', label: '历史对话如何快速检索和引用？', themeId: 't6' },
  { id: 'q6-7', label: 'AI 回复的置信度如何可视化？', themeId: 't6' },
  { id: 'q6-8', label: '如何设计一键应用/撤销功能？', themeId: 't6' },
  { id: 'q6-9', label: '移动端和桌面端的交互差异如何处理？', themeId: 't6' },
  { id: 'q6-10', label: '如何收集用户对生成结果的反馈？', themeId: 't6' },

  // t7: 调试、日志与监控
  { id: 'q7-1', label: 'AI 调用链路如何追踪？', themeId: 't7' },
  { id: 'q7-2', label: 'Prompt 和响应如何记录日志？', themeId: 't7' },
  { id: 'q7-3', label: '如何监控 API 调用的延迟和成功率？', themeId: 't7' },
  { id: 'q7-4', label: '生成错误的分类和统计怎么做？', themeId: 't7' },
  { id: 'q7-5', label: '如何定位是 Prompt 问题还是模型问题？', themeId: 't7' },
  { id: 'q7-6', label: '日志中如何脱敏敏感信息？', themeId: 't7' },
  { id: 'q7-7', label: '如何设置关键指标的告警阈值？', themeId: 't7' },
  { id: 'q7-8', label: '调试模式如何快速开关？', themeId: 't7' },
  { id: 'q7-9', label: '如何可视化 Token 消耗趋势？', themeId: 't7' },
  { id: 'q7-10', label: '异常调用如何自动采样和分析？', themeId: 't7' },

  // t8: 兼容性与集成
  { id: 'q8-1', label: '如何支持多种 LLM 提供商切换？', themeId: 't8' },
  { id: 'q8-2', label: '不同模型的 API 差异如何抽象？', themeId: 't8' },
  { id: 'q8-3', label: '如何与现有系统（如 Jira、GitHub）集成？', themeId: 't8' },
  { id: 'q8-4', label: '生成的代码如何适配不同框架版本？', themeId: 't8' },
  { id: 'q8-5', label: '如何兼容不同的部署环境？', themeId: 't8' },
  { id: 'q8-6', label: 'API 版本升级如何平滑过渡？', themeId: 't8' },
  { id: 'q8-7', label: '如何支持私有化部署的模型？', themeId: 't8' },
  { id: 'q8-8', label: '浏览器和 Node.js 环境的差异如何处理？', themeId: 't8' },
  { id: 'q8-9', label: '如何对接企业内部的认证系统？', themeId: 't8' },
  { id: 'q8-10', label: '数据格式变更如何保持向后兼容？', themeId: 't8' },

  // t9: 安全、权限与治理
  { id: 'q9-1', label: '如何防止 Prompt 注入攻击？', themeId: 't9' },
  { id: 'q9-2', label: 'AI 生成的代码如何审计安全性？', themeId: 't9' },
  { id: 'q9-3', label: '敏感数据如何防止泄露给模型？', themeId: 't9' },
  { id: 'q9-4', label: '用户权限如何控制 AI 功能访问？', themeId: 't9' },
  { id: 'q9-5', label: '如何检测和过滤有害生成内容？', themeId: 't9' },
  { id: 'q9-6', label: 'AI 调用的审计日志如何设计？', themeId: 't9' },
  { id: 'q9-7', label: '如何防止越权操作（如删除数据）？', themeId: 't9' },
  { id: 'q9-8', label: '模型返回的内容如何合规检查？', themeId: 't9' },
  { id: 'q9-9', label: '如何管理 API Key 的安全存储？', themeId: 't9' },
  { id: 'q9-10', label: '数据隐私法规（如 GDPR）如何遵守？', themeId: 't9' },

  // t10: 效率、迭代与扩展
  { id: 'q10-1', label: '如何快速迭代 Prompt 模板？', themeId: 't10' },
  { id: 'q10-2', label: 'A/B 测试如何评估不同 Prompt 效果？', themeId: 't10' },
  { id: 'q10-3', label: '如何建立可复用的 Skill 库？', themeId: 't10' },
  { id: 'q10-4', label: '团队协作的 Prompt 版本如何管理？', themeId: 't10' },
  { id: 'q10-5', label: '如何自动化测试 AI 功能？', themeId: 't10' },
  { id: 'q10-6', label: '性能瓶颈如何定位和优化？', themeId: 't10' },
  { id: 'q10-7', label: '如何扩展支持新的模型或功能？', themeId: 't10' },
  { id: 'q10-8', label: '用户反馈如何快速转化为改进？', themeId: 't10' },
  { id: 'q10-9', label: '如何量化 AI 带来的效率提升？', themeId: 't10' },
  { id: 'q10-10', label: '系统如何水平扩展应对增长？', themeId: 't10' },
]

// === 第二个图谱：AI Agent 关键词图谱 ===
const agentCategories = [
  { id: 'role', label: '作用', color: '#10b981' },
  { id: 'func', label: '功能', color: '#2563eb' },
  { id: 'tech', label: '技术', color: '#7c3aed' },
  { id: 'principle', label: '原理', color: '#d97706' },
]

const agentKeywords: { id: string; label: string; categoryId: string }[] = [
  // 作用类 (30个)
  { id: 'a1', label: '自主执行', categoryId: 'role' },
  { id: 'a2', label: '代码生成', categoryId: 'role' },
  { id: 'a3', label: '代码理解', categoryId: 'role' },
  { id: 'a4', label: '代码调试', categoryId: 'role' },
  { id: 'a5', label: '代码重构', categoryId: 'role' },
  { id: 'a6', label: '代码补全', categoryId: 'role' },
  { id: 'a7', label: '文件操作', categoryId: 'role' },
  { id: 'a8', label: '项目分析', categoryId: 'role' },
  { id: 'a9', label: '浏览器自动化', categoryId: 'role' },
  { id: 'a10', label: '网页控制', categoryId: 'role' },
  { id: 'a11', label: '数据抓取', categoryId: 'role' },
  { id: 'a12', label: '定时任务', categoryId: 'role' },
  { id: 'a13', label: '无人值守', categoryId: 'role' },
  { id: 'a14', label: '7x24运行', categoryId: 'role' },
  { id: 'a15', label: '多渠道接入', categoryId: 'role' },
  { id: 'a16', label: 'IM集成', categoryId: 'role' },
  { id: 'a17', label: 'WebUI', categoryId: 'role' },
  { id: 'a18', label: '多端同步', categoryId: 'role' },
  { id: 'a19', label: '部署上线', categoryId: 'role' },
  { id: 'a20', label: '托管服务', categoryId: 'role' },
  { id: 'a21', label: 'CI/CD', categoryId: 'role' },
  { id: 'a22', label: '团队协作', categoryId: 'role' },
  { id: 'a23', label: '权限管理', categoryId: 'role' },
  { id: 'a24', label: '数据共享', categoryId: 'role' },
  { id: 'a25', label: '智能检索', categoryId: 'role' },
  { id: 'a26', label: '语义匹配', categoryId: 'role' },
  { id: 'a27', label: '记忆召回', categoryId: 'role' },
  { id: 'a28', label: '成本优化', categoryId: 'role' },
  { id: 'a29', label: '资源调度', categoryId: 'role' },
  { id: 'a30', label: '效率提升', categoryId: 'role' },

  // 功能类 (30个)
  { id: 'f1', label: '会话管理', categoryId: 'func' },
  { id: 'f2', label: '上下文维护', categoryId: 'func' },
  { id: 'f3', label: '状态管理', categoryId: 'func' },
  { id: 'f4', label: '跨会话持久', categoryId: 'func' },
  { id: 'f5', label: '技能系统', categoryId: 'func' },
  { id: 'f6', label: '技能库', categoryId: 'func' },
  { id: 'f7', label: '动态加载', categoryId: 'func' },
  { id: 'f8', label: '技能市场', categoryId: 'func' },
  { id: 'f9', label: 'API集成', categoryId: 'func' },
  { id: 'f10', label: 'HTTP请求', categoryId: 'func' },
  { id: 'f11', label: '第三方服务', categoryId: 'func' },
  { id: 'f12', label: '服务编排', categoryId: 'func' },
  { id: 'f13', label: '任务规划', categoryId: 'func' },
  { id: 'f14', label: '任务拆解', categoryId: 'func' },
  { id: 'f15', label: '步骤编排', categoryId: 'func' },
  { id: 'f16', label: '工作流', categoryId: 'func' },
  { id: 'f17', label: '工具调用', categoryId: 'func' },
  { id: 'f18', label: '参数校验', categoryId: 'func' },
  { id: 'f19', label: '工具调度', categoryId: 'func' },
  { id: 'f20', label: '并行执行', categoryId: 'func' },
  { id: 'f21', label: '可观测性', categoryId: 'func' },
  { id: 'f22', label: '审计追踪', categoryId: 'func' },
  { id: 'f23', label: '监控告警', categoryId: 'func' },
  { id: 'f24', label: '日志记录', categoryId: 'func' },
  { id: 'f25', label: '错误处理', categoryId: 'func' },
  { id: 'f26', label: '自修复', categoryId: 'func' },
  { id: 'f27', label: '重试机制', categoryId: 'func' },
  { id: 'f28', label: '容错降级', categoryId: 'func' },
  { id: 'f29', label: '多模态理解', categoryId: 'func' },
  { id: 'f30', label: '文档解析', categoryId: 'func' },

  // 技术类 (30个)
  { id: 't1', label: 'Docker', categoryId: 'tech' },
  { id: 't2', label: 'Kubernetes', categoryId: 'tech' },
  { id: 't3', label: '容器化', categoryId: 'tech' },
  { id: 't4', label: 'Pod编排', categoryId: 'tech' },
  { id: 't5', label: '镜像管理', categoryId: 'tech' },
  { id: 't6', label: '卷挂载', categoryId: 'tech' },
  { id: 't7', label: 'Node.js', categoryId: 'tech' },
  { id: 't8', label: 'Bun', categoryId: 'tech' },
  { id: 't9', label: 'Python', categoryId: 'tech' },
  { id: 't10', label: 'TypeScript', categoryId: 'tech' },
  { id: 't11', label: 'ES Module', categoryId: 'tech' },
  { id: 't12', label: 'CLI工具', categoryId: 'tech' },
  { id: 't13', label: 'REPL', categoryId: 'tech' },
  { id: 't14', label: '终端操作', categoryId: 'tech' },
  { id: 't15', label: 'Shell脚本', categoryId: 'tech' },
  { id: 't16', label: 'REST API', categoryId: 'tech' },
  { id: 't17', label: 'gRPC', categoryId: 'tech' },
  { id: 't18', label: 'WebSocket', categoryId: 'tech' },
  { id: 't19', label: 'MCP协议', categoryId: 'tech' },
  { id: 't20', label: 'Git', categoryId: 'tech' },
  { id: 't21', label: '代码仓库', categoryId: 'tech' },
  { id: 't22', label: '分支管理', categoryId: 'tech' },
  { id: 't23', label: 'SQLite', categoryId: 'tech' },
  { id: 't24', label: 'PostgreSQL', categoryId: 'tech' },
  { id: 't25', label: 'MySQL', categoryId: 'tech' },
  { id: 't26', label: '向量数据库', categoryId: 'tech' },
  { id: 't27', label: 'FTS5', categoryId: 'tech' },
  { id: 't28', label: '消息队列', categoryId: 'tech' },
  { id: 't29', label: '事件驱动', categoryId: 'tech' },
  { id: 't30', label: '流式处理', categoryId: 'tech' },

  // 原理类 (30个)
  { id: 'p1', label: 'Agent闭环', categoryId: 'principle' },
  { id: 'p2', label: 'ReAct', categoryId: 'principle' },
  { id: 'p3', label: '思维链', categoryId: 'principle' },
  { id: 'p4', label: '自进化', categoryId: 'principle' },
  { id: 'p5', label: '可写运行时', categoryId: 'principle' },
  { id: 'p6', label: '技能自生成', categoryId: 'principle' },
  { id: 'p7', label: '经验沉淀', categoryId: 'principle' },
  { id: 'p8', label: '分层记忆', categoryId: 'principle' },
  { id: 'p9', label: '短期记忆', categoryId: 'principle' },
  { id: 'p10', label: '长期记忆', categoryId: 'principle' },
  { id: 'p11', label: '程序性记忆', categoryId: 'principle' },
  { id: 'p12', label: '用户建模', categoryId: 'principle' },
  { id: 'p13', label: '上下文窗口', categoryId: 'principle' },
  { id: 'p14', label: '上下文压缩', categoryId: 'principle' },
  { id: 'p15', label: 'Prompt Cache', categoryId: 'principle' },
  { id: 'p16', label: 'KV Cache', categoryId: 'principle' },
  { id: 'p17', label: '混合专家', categoryId: 'principle' },
  { id: 'p18', label: '动态路由', categoryId: 'principle' },
  { id: 'p19', label: '双模式推理', categoryId: 'principle' },
  { id: 'p20', label: '思维树', categoryId: 'principle' },
  { id: 'p21', label: '安全对齐', categoryId: 'principle' },
  { id: 'p22', label: '宪法AI', categoryId: 'principle' },
  { id: 'p23', label: '可解释性', categoryId: 'principle' },
  { id: 'p24', label: '低幻觉', categoryId: 'principle' },
  { id: 'p25', label: '沙箱隔离', categoryId: 'principle' },
  { id: 'p26', label: 'Cell Isolation', categoryId: 'principle' },
  { id: 'p27', label: '最小权限', categoryId: 'principle' },
  { id: 'p28', label: '模块解耦', categoryId: 'principle' },
  { id: 'p29', label: '三层架构', categoryId: 'principle' },
  { id: 'p30', label: '声明式配置', categoryId: 'principle' },
]

// AI Agent 关键词之间的关联 (50条)
const agentEdges: { source: string; target: string }[] = [
  // 核心关联 (20条)
  { source: 'p1', target: 'a1' },
  { source: 'p8', target: 'f4' },
  { source: 'p4', target: 'f5' },
  { source: 'p25', target: 't1' },
  { source: 'p13', target: 'f2' },
  { source: 'p17', target: 'f19' },
  { source: 'f13', target: 'f16' },
  { source: 'a16', target: 't18' },
  { source: 'a2', target: 't7' },
  { source: 'a25', target: 't27' },
  { source: 'p21', target: 'p22' },
  { source: 'p9', target: 'p10' },
  { source: 'f7', target: 'f8' },
  { source: 't20', target: 't21' },
  { source: 't23', target: 't27' },
  { source: 'a12', target: 'a13' },
  { source: 'f25', target: 'f27' },
  { source: 'p2', target: 'p3' },
  { source: 't28', target: 't29' },
  { source: 'a22', target: 'a23' },

  // 次要关联 (20条)
  { source: 'p28', target: 't11' },
  { source: 'p30', target: 'f16' },
  { source: 't3', target: 'p26' },
  { source: 't2', target: 'f20' },
  { source: 't28', target: 'p29' },
  { source: 'f21', target: 'p1' },
  { source: 'f26', target: 'a1' },
  { source: 'a19', target: 't1' },
  { source: 'a22', target: 'f24' },
  { source: 'a28', target: 'p14' },
  { source: 'p5', target: 'p6' },
  { source: 'f9', target: 't16' },
  { source: 'f29', target: 'f30' },
  { source: 't9', target: 'f29' },
  { source: 'p18', target: 'f19' },
  { source: 'a9', target: 't12' },
  { source: 'f1', target: 'p9' },
  { source: 't24', target: 'f3' },
  { source: 'p19', target: 'p20' },
  { source: 'a30', target: 'f14' },

  // 跨类别关联 (10条)
  { source: 'p1', target: 'f21' },
  { source: 'p4', target: 'f5' },
  { source: 'p8', target: 'f4' },
  { source: 'p21', target: 'p25' },
  { source: 'p17', target: 'f19' },
  { source: 'f13', target: 'f15' },
  { source: 't20', target: 'a21' },
  { source: 't26', target: 'a26' },
  { source: 'f25', target: 'f28' },
  { source: 'p14', target: 'a28' },
]

// === 预计算的稳定节点位置（随机混合分布） ===
const precomputedPositions: Record<string, { x: number; y: number }> = {
  a1: { x: 413.9, y: 520.7 }, a2: { x: 625, y: 515.3 }, a3: { x: 539.2, y: 570 },
  a4: { x: 122.9, y: 275.3 }, a5: { x: 267.4, y: 485.1 }, a6: { x: 460.6, y: 192.8 },
  a7: { x: 606.4, y: 30 }, a8: { x: 401, y: 570 }, a9: { x: 691.7, y: 570 },
  a10: { x: 558.4, y: 30 }, a11: { x: 609.8, y: 392.5 }, a12: { x: 512, y: 30 },
  a13: { x: 489, y: 89.5 }, a14: { x: 585.4, y: 570 }, a15: { x: 713.8, y: 99.1 },
  a16: { x: 416, y: 223.2 }, a17: { x: 516.7, y: 463.6 }, a18: { x: 560.2, y: 435.7 },
  a19: { x: 667.9, y: 469.6 }, a20: { x: 249.8, y: 570 }, a21: { x: 754.5, y: 226.1 },
  a22: { x: 309.9, y: 214.1 }, a23: { x: 279.4, y: 163.6 }, a24: { x: 554.6, y: 140.9 },
  a25: { x: 704.7, y: 264.1 }, a26: { x: 621, y: 200.5 }, a27: { x: 339.7, y: 30 },
  a28: { x: 595.7, y: 88.2 }, a29: { x: 776.7, y: 92.4 }, a30: { x: 291.4, y: 30 },
  f1: { x: 370.8, y: 489 }, f2: { x: 357.7, y: 315.5 }, f3: { x: 658.2, y: 30 },
  f4: { x: 152.6, y: 148.2 }, f5: { x: 337.3, y: 150.8 }, f6: { x: 532.6, y: 278.9 },
  f7: { x: 312.4, y: 388.1 }, f8: { x: 317.9, y: 449 }, f9: { x: 519.6, y: 334.6 },
  f10: { x: 516.9, y: 222.2 }, f11: { x: 216.9, y: 523.4 }, f12: { x: 491.6, y: 570 },
  f13: { x: 422.3, y: 391.4 }, f14: { x: 325.7, y: 86.1 }, f15: { x: 418.7, y: 453 },
  f16: { x: 408.4, y: 330.4 }, f17: { x: 234.5, y: 30 }, f18: { x: 193, y: 256.4 },
  f19: { x: 434.2, y: 84.2 }, f20: { x: 758.5, y: 296.9 }, f21: { x: 468.2, y: 432.2 },
  f22: { x: 556.2, y: 380.4 }, f23: { x: 369.9, y: 426.6 }, f24: { x: 309.9, y: 272.9 },
  f25: { x: 574.3, y: 328.9 }, f26: { x: 447.7, y: 570 }, f27: { x: 616.2, y: 292.6 },
  f28: { x: 635.2, y: 343.9 }, f29: { x: 189.3, y: 380.4 }, f30: { x: 188.1, y: 318.8 },
  t1: { x: 662.8, y: 411.1 }, t2: { x: 757.1, y: 357.6 }, t3: { x: 223.4, y: 136.9 },
  t4: { x: 827.8, y: 359.6 }, t5: { x: 821.1, y: 228.3 }, t6: { x: 797.8, y: 417.5 },
  t7: { x: 610, y: 456.5 }, t8: { x: 269.9, y: 97.8 }, t9: { x: 138.9, y: 417.4 },
  t10: { x: 636, y: 570 }, t11: { x: 262.7, y: 417.1 }, t12: { x: 703.5, y: 510.3 },
  t13: { x: 160.2, y: 491.7 }, t14: { x: 503.8, y: 157.8 }, t15: { x: 685.2, y: 208.3 },
  t16: { x: 473.1, y: 301.1 }, t17: { x: 504.2, y: 394.7 }, t18: { x: 471, y: 249 },
  t19: { x: 718.2, y: 30 }, t20: { x: 735.2, y: 166.7 }, t21: { x: 674.5, y: 151.5 },
  t22: { x: 803.6, y: 161.1 }, t23: { x: 580.6, y: 250.1 }, t24: { x: 653.5, y: 90.2 },
  t25: { x: 355, y: 570 }, t26: { x: 562, y: 195.4 }, t27: { x: 644.5, y: 251.9 },
  t28: { x: 397.4, y: 162.9 }, t29: { x: 449.6, y: 137.6 }, t30: { x: 247, y: 358.6 },
  p1: { x: 464.1, y: 492.9 }, p2: { x: 249.7, y: 296.1 }, p3: { x: 299.9, y: 331 },
  p4: { x: 361.7, y: 206.7 }, p5: { x: 773.4, y: 476.5 }, p6: { x: 760.7, y: 538.8 },
  p7: { x: 383, y: 30 }, p8: { x: 137.1, y: 207.8 }, p9: { x: 319.2, y: 514.3 },
  p10: { x: 304.5, y: 570 }, p11: { x: 365.7, y: 371.5 }, p12: { x: 187.9, y: 80 },
  p13: { x: 418.6, y: 282.3 }, p14: { x: 613.3, y: 145.6 }, p15: { x: 539.9, y: 86.4 },
  p16: { x: 463.5, y: 355.9 }, p17: { x: 467.7, y: 30 }, p18: { x: 424.9, y: 30 },
  p19: { x: 567.1, y: 505.8 }, p20: { x: 510.2, y: 521.5 }, p21: { x: 700.7, y: 370.9 },
  p22: { x: 686, y: 314.4 }, p23: { x: 120.1, y: 345.2 }, p24: { x: 257.2, y: 235.9 },
  p25: { x: 723.3, y: 428.2 }, p26: { x: 213, y: 196.2 }, p27: { x: 826.3, y: 293.2 },
  p28: { x: 210.3, y: 445.2 }, p29: { x: 381.2, y: 104.8 }, p30: { x: 371, y: 268 },
}

// === 第二个图谱的 Canvas 状态 ===
const canvas2Ref = ref<HTMLCanvasElement | null>(null)
const hoveredNode2 = ref<string | null>(null)
const highlightedCategory = ref<string | null>(null) // null=全部显示, 有值=高亮该类别

// 拖动状态
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let offsetX = 0  // 画布偏移量
let offsetY = 0

interface AgentNode {
  id: string
  label: string
  categoryId: string
  color: string
  x: number
  y: number
  vx: number
  vy: number
}

let agentNodes: AgentNode[] = []
let canvas2W = 0
let canvas2H = 0

// === 小问题之间的强关联连线 ===
const questionEdges: { source: string; target: string }[] = [
  // 稳定性 ↔ 监控
  { source: 'q1-1', target: 'q7-3' },
  { source: 'q1-2', target: 'q7-1' },
  { source: 'q1-9', target: 'q7-7' },
  // Token ↔ 成本监控
  { source: 'q2-5', target: 'q7-9' },
  { source: 'q2-6', target: 'q7-7' },
  { source: 'q2-8', target: 'q10-1' },
  // 生成质量 ↔ 调试
  { source: 'q3-6', target: 'q7-5' },
  { source: 'q3-10', target: 'q10-2' },
  // 产物管理 ↔ 版本控制
  { source: 'q4-1', target: 'q10-3' },
  { source: 'q4-5', target: 'q10-4' },
  // Agent ↔ 交互
  { source: 'q5-1', target: 'q6-1' },
  { source: 'q5-8', target: 'q7-1' },
  // 交互 ↔ 反馈
  { source: 'q6-10', target: 'q10-8' },
  // 监控 ↔ 调试
  { source: 'q7-1', target: 'q7-8' },
  // 兼容性 ↔ 扩展
  { source: 'q8-1', target: 'q10-7' },
  { source: 'q8-6', target: 'q4-5' },
  // 安全 ↔ 审计
  { source: 'q9-6', target: 'q4-10' },
  { source: 'q9-3', target: 'q7-6' },
  // 效率 ↔ 质量
  { source: 'q10-1', target: 'q3-1' },
  { source: 'q10-5', target: 'q3-5' },
]

// === Canvas 力导向图谱 ===
const canvasRef = ref<HTMLCanvasElement | null>(null)
const hoveredNode = ref<string | null>(null)
const activeTheme = ref<string>('t2') // 默认选中 Token 主题

interface Node {
  id: string
  label: string
  type: 'theme' | 'question'
  themeId?: string
  color: string
  x: number
  y: number
  vx: number
  vy: number
}

let nodes: Node[] = []
let animId = 0
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

  // 初始加载默认主题（Token）
  loadTheme(activeTheme.value)
}

function loadTheme(themeId: string) {
  // 清空当前所有节点
  nodes = []
  
  const theme = themes.find(t => t.id === themeId)!
  const centerX = canvasW / 2
  const centerY = canvasH / 2

  // 主题放在画布中心
  const themeNode: Node = {
    id: theme.id,
    label: theme.label,
    type: 'theme',
    color: theme.color,
    x: centerX,
    y: centerY,
    vx: 0,
    vy: 0,
  }
  nodes.push(themeNode)

  // 子问题随机分布在主题周围（非规则圆形，给初始速度让力导向自然排列）
  const themeQuestions = questions.filter(q => q.themeId === themeId)
  
  // 使用分层随机分布，填满画布，避免规则圆形
  const margin = 100 // 边距
  const availableW = canvasW - margin * 2
  const availableH = canvasH - margin * 2
  
  themeQuestions.forEach((q, i) => {
    // 将画布分成多个区域，每个子问题占据一个区域
    const cols = 4 // 列数
    const rows = 3 // 行数
    const cellW = availableW / cols
    const cellH = availableH / rows
    
    // 计算该问题应该在哪一格
    const col = i % cols
    const row = Math.floor(i / cols)
    
    // 在格子里随机位置
    const x = margin + col * cellW + Math.random() * cellW
    const y = margin + row * cellH + Math.random() * cellH
    
    nodes.push({
      id: q.id,
      label: q.label,
      type: 'question',
      themeId: q.themeId,
      color: '#9ca3af',
      x: x,
      y: y,
      vx: 0,
      vy: 0,
    })
  })

  activeTheme.value = themeId
}

function selectTheme(themeId: string) {
  if (activeTheme.value === themeId) return
  loadTheme(themeId)
}

function simulate() {
  const repulsion = 8000        // 增大斥力，防止文字重叠
  const themeRepulsion = 6000
  const attraction = 0.008

  const centerForce = 0.002
  const damping = 0.93

  function tick() {
    if (nodes.length === 0) {
      animId = requestAnimationFrame(tick)
      return
    }

    // 斥力
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x
        const dy = nodes[j].y - nodes[i].y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        
        const isBothThemes = nodes[i].type === 'theme' && nodes[j].type === 'theme'
        const force = (isBothThemes ? themeRepulsion : repulsion) / (dist * dist)
        
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        nodes[i].vx -= fx
        nodes[i].vy -= fy
        nodes[j].vx += fx
        nodes[j].vy += fy
      }
    }

    // 去掉主题与子问题之间的引力，让子问题保持分散分布

    // 引力：小问题之间的强关联
    questionEdges.forEach(edge => {
      const a = nodes.find(n => n.id === edge.source)
      const b = nodes.find(n => n.id === edge.target)
      if (!a || !b) return
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const idealDist = 50
      const force = (dist - idealDist) * attraction
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx += fx
      a.vy += fy
      b.vx -= fx
      b.vy -= fy
    })

    // 中心引力
    const centerX = canvasW / 2
    const centerY = canvasH / 2
    nodes.forEach(node => {
      node.vx += (centerX - node.x) * centerForce
      node.vy += (centerY - node.y) * centerForce
    })

    // 更新位置
    nodes.forEach(node => {
      node.vx *= damping
      node.vy *= damping
      node.x += node.vx
      node.y += node.vy
      // 边界限制
      const margin = node.type === 'theme' ? 50 : 80
      node.x = Math.max(margin, Math.min(canvasW - margin, node.x))
      node.y = Math.max(margin, Math.min(canvasH - margin, node.y))
    })

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

  if (nodes.length === 0) {
    // 空状态提示
    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = '#9ca3af'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('点击上方标签添加主题', canvasW / 2, canvasH / 2)
    return
  }

  const hovered = nodes.find(n => n.id === hoveredNode.value)

  // 判断节点是否应该高亮
  const isHighlighted = (node: Node) => {
    if (!hovered) return true
    if (node.id === hovered.id) return true
    if (hovered.type === 'theme') {
      if (node.type === 'theme') return false
      return node.themeId === hovered.id
    }
    if (hovered.type === 'question') {
      if (node.id === hovered.themeId) return true
      if (node.type === 'question') {
        if (node.themeId === hovered.themeId) return true
        const isRelated = questionEdges.some(
          e => (e.source === hovered.id && e.target === node.id) ||
               (e.target === hovered.id && e.source === node.id)
        )
        return isRelated
      }
    }
    return false
  }

  // 获取连线透明度
  const getEdgeOpacity = (source: string, target: string) => {
    if (!hovered) return 0.1
    const s = nodes.find(n => n.id === source)
    const t = nodes.find(n => n.id === target)
    if (!s || !t) return 0.02

    if (s.type === 'theme' && t.type === 'question' && t.themeId === s.id) {
      if (hovered.id === s.id) return 0.4
      if (hovered.id === t.id) return 0.4
      if (hovered.type === 'question' && hovered.themeId === s.id) return 0.15
      return 0.02
    }

    const isConnected = questionEdges.some(
      e => (e.source === source && e.target === target) ||
           (e.source === target && e.target === source)
    )
    if (isConnected) {
      if (hovered.id === source || hovered.id === target) return 0.5
      return 0.02
    }

    return 0.02
  }

  // 画主题→小问题的连线
  nodes.forEach(theme => {
    if (theme.type !== 'theme') return
    nodes.forEach(q => {
      if (q.type !== 'question' || q.themeId !== theme.id) return
      ctx.beginPath()
      ctx.moveTo(theme.x, theme.y)
      ctx.lineTo(q.x, q.y)
      ctx.strokeStyle = `rgba(150, 150, 150, ${getEdgeOpacity(theme.id, q.id)})`
      ctx.lineWidth = 1
      ctx.stroke()
    })
  })

  // 画小问题之间的强关联连线（虚线）
  ctx.setLineDash([3, 3])
  questionEdges.forEach(edge => {
    const a = nodes.find(n => n.id === edge.source)
    const b = nodes.find(n => n.id === edge.target)
    if (!a || !b) return
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = `rgba(100, 100, 100, ${getEdgeOpacity(edge.source, edge.target)})`
    ctx.lineWidth = 1
    ctx.stroke()
  })
  ctx.setLineDash([])

  // 画节点
  nodes.forEach(node => {
    const highlighted = isHighlighted(node)
    const isHovered = node.id === hoveredNode.value
    ctx.globalAlpha = highlighted ? 1 : 0.15

    if (node.type === 'theme') {
      // 主题节点
      const radius = isHovered ? 14 : 10
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.globalAlpha = 0.85
      ctx.fill()

      // 边框
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = node.color
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.5
      ctx.stroke()

      // 光晕
      if (isHovered) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius + 8, 0, 2 * Math.PI)
        ctx.strokeStyle = node.color
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.2
        ctx.stroke()
      }

      ctx.globalAlpha = highlighted ? 1 : 0.15

      // 主题标签（换行显示）
      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif'
      ctx.fillStyle = node.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      
      const maxWidth = 100
      const words = node.label.split('')
      let line = ''
      const lines: string[] = []
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && line.length > 0) {
          lines.push(line)
          line = words[i]
        } else {
          line = testLine
        }
      }
      lines.push(line)
      
      const labelY = node.y + radius + 10
      lines.forEach((l, i) => {
        ctx.fillText(l, node.x, labelY + i * 15)
      })
    } else {
      // 小问题节点
      const themeColor = themes.find(t => t.id === node.themeId)?.color || '#9ca3af'
      const radius = isHovered ? 5 : 3
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = isHovered ? themeColor : '#9ca3af'
      ctx.globalAlpha = highlighted ? 1 : 0.2
      ctx.fill()

      // 子问题标签（增大字号）
      ctx.font = isHovered ? '500 12px -apple-system, BlinkMacSystemFont, sans-serif' : '400 11px -apple-system, BlinkMacSystemFont, sans-serif'
      ctx.fillStyle = isHovered ? '#374151' : '#6b7280'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      const labelX = node.x + radius + 6
      const shortLabel = node.label.length > 22 ? node.label.slice(0, 22) + '...' : node.label
      ctx.globalAlpha = highlighted ? 1 : 0.3
      ctx.fillText(shortLabel, labelX, node.y)
    }

    ctx.globalAlpha = 1
  })
}

function getNodeAt(x: number, y: number): Node | null {
  for (const node of nodes) {
    const dx = node.x - x
    const dy = node.y - y
    const radius = node.type === 'theme' ? 14 : 6
    if (dx * dx + dy * dy < radius * radius) return node
  }
  return null
}

function getCanvasPos(e: MouseEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onMouseMove(e: MouseEvent) {
  const pos = getCanvasPos(e)
  const node = getNodeAt(pos.x, pos.y)
  const newHovered = node?.id || null

  if (newHovered !== hoveredNode.value) {
    hoveredNode.value = newHovered
    if (node) {
      canvasRef.value!.style.cursor = 'pointer'
    } else {
      canvasRef.value!.style.cursor = 'default'
    }
  }
}

function onMouseLeave() {
  hoveredNode.value = null
}

// === 第二个图谱的函数 ===
function initAgentGraph() {
  const canvas = canvas2Ref.value!
  const rect = canvas.parentElement!.getBoundingClientRect()
  canvas2W = rect.width
  canvas2H = rect.height
  canvas.width = canvas2W * devicePixelRatio
  canvas.height = canvas2H * devicePixelRatio
  canvas.style.width = canvas2W + 'px'
  canvas.style.height = canvas2H + 'px'

  // 使用预计算的稳定位置，一次性加载全部120个节点
  agentNodes = agentKeywords.map(keyword => {
    const category = agentCategories.find(c => c.id === keyword.categoryId)!
    const pos = precomputedPositions[keyword.id] || { x: canvas2W / 2, y: canvas2H / 2 }
    return {
      id: keyword.id,
      label: keyword.label,
      categoryId: keyword.categoryId,
      color: category.color,
      x: pos.x,
      y: pos.y,
      vx: 0,
      vy: 0,
    }
  })

  drawAgentGraph()
}

function selectCategory(categoryId: string) {
  // 点击按钮只是高亮当前类别，不筛选节点
  if (highlightedCategory.value === categoryId) {
    highlightedCategory.value = null // 再次点击取消高亮
  } else {
    highlightedCategory.value = categoryId
  }
  drawAgentGraph()
}

function drawAgentGraph() {
  const canvas = canvas2Ref.value!
  const ctx = canvas.getContext('2d')!
  const dpr = devicePixelRatio
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, canvas2W, canvas2H)

  if (agentNodes.length === 0) {
    ctx.font = '400 14px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = '#9ca3af'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('加载中...', canvas2W / 2, canvas2H / 2)
    return
  }

  const hovered = agentNodes.find(n => n.id === hoveredNode2.value)

  // 判断节点是否应该高亮（支持 hover 和类别按钮两种高亮）
  const isHighlighted = (node: AgentNode) => {
    // hover 优先级最高
    if (hovered) {
      if (node.id === hovered.id) return true
      if (node.categoryId === hovered.categoryId) return true
      const isRelated = agentEdges.some(
        e => (e.source === hovered.id && e.target === node.id) ||
             (e.target === hovered.id && e.source === node.id)
      )
      return isRelated
    }
    // 类别按钮高亮
    if (highlightedCategory.value) {
      return node.categoryId === highlightedCategory.value
    }
    // 默认全部显示
    return true
  }

  // 获取连线透明度
  const getEdgeOpacity = (source: string, target: string) => {
    if (hovered) {
      if (hovered.id === source || hovered.id === target) return 0.6
      return 0.05
    }
    if (highlightedCategory.value) {
      const s = agentNodes.find(n => n.id === source)
      const t = agentNodes.find(n => n.id === target)
      if (s?.categoryId === highlightedCategory.value && t?.categoryId === highlightedCategory.value) return 0.4
      if (s?.categoryId === highlightedCategory.value || t?.categoryId === highlightedCategory.value) return 0.2
      return 0.03
    }
    return 0.15
  }

  // 应用偏移量绘制
  ctx.save()
  ctx.translate(offsetX, offsetY)

  // 画关联连线
  ctx.setLineDash([3, 3])
  agentEdges.forEach(edge => {
    const a = agentNodes.find(n => n.id === edge.source)
    const b = agentNodes.find(n => n.id === edge.target)
    if (!a || !b) return
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = `rgba(100, 100, 100, ${getEdgeOpacity(edge.source, edge.target)})`
    ctx.lineWidth = 1
    ctx.stroke()
  })
  ctx.setLineDash([])

  // 画节点
  agentNodes.forEach(node => {
    const highlighted = isHighlighted(node)
    const isHovered = node.id === hoveredNode2.value
    ctx.globalAlpha = highlighted ? 1 : 0.15

    const radius = isHovered ? 6 : 4
    
    ctx.beginPath()
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = node.color
    ctx.globalAlpha = highlighted ? 0.9 : 0.15
    ctx.fill()

    // 边框
    if (isHovered) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = node.color
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.5
      ctx.stroke()

      // 光晕
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius + 6, 0, 2 * Math.PI)
      ctx.strokeStyle = node.color
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.2
      ctx.stroke()
    }

    // 标签
    ctx.globalAlpha = highlighted ? 1 : 0.3
    ctx.font = isHovered ? '500 12px -apple-system, BlinkMacSystemFont, sans-serif' : '400 11px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = isHovered ? '#374151' : '#6b7280'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const labelX = node.x + radius + 6
    ctx.fillText(node.label, labelX, node.y)

    ctx.globalAlpha = 1
  })

  ctx.restore()
}

function getNodeAt2(x: number, y: number): AgentNode | null {
  for (const node of agentNodes) {
    const dx = node.x - x
    const dy = node.y - y
    const radius = 6
    if (dx * dx + dy * dy < radius * radius) return node
  }
  return null
}

function getCanvasPos2(e: MouseEvent) {
  const rect = canvas2Ref.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onMouseDown2(e: MouseEvent) {
  const pos = getCanvasPos2(e)
  const node = getNodeAt2(pos.x - offsetX, pos.y - offsetY)
  if (!node) {
    // 点击空白区域，开始拖动
    isDragging = true
    dragStartX = e.clientX - offsetX
    dragStartY = e.clientY - offsetY
    canvas2Ref.value!.style.cursor = 'grabbing'
  }
}

function onMouseMove2(e: MouseEvent) {
  if (isDragging) {
    // 拖动中，更新偏移量
    offsetX = e.clientX - dragStartX
    offsetY = e.clientY - dragStartY
    return
  }

  const pos = getCanvasPos2(e)
  const node = getNodeAt2(pos.x - offsetX, pos.y - offsetY)
  const newHovered = node?.id || null

  if (newHovered !== hoveredNode2.value) {
    hoveredNode2.value = newHovered
    if (node) {
      canvas2Ref.value!.style.cursor = 'pointer'
    } else {
      canvas2Ref.value!.style.cursor = 'grab'
    }
  }
}

function onMouseUp2() {
  if (isDragging) {
    isDragging = false
    canvas2Ref.value!.style.cursor = 'grab'
  }
}

function onMouseLeave2() {
  hoveredNode2.value = null
  if (isDragging) {
    isDragging = false
    canvas2Ref.value!.style.cursor = 'default'
  }
}

let resizeObserver2: ResizeObserver | null = null

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  // 第一个图谱
  initGraph()
  simulate()
  resizeObserver = new ResizeObserver(() => {
    initGraph()
  })
  resizeObserver.observe(canvasRef.value!.parentElement!)

  // 第二个图谱
  initAgentGraph()
  resizeObserver2 = new ResizeObserver(() => {
    initAgentGraph()
  })
  resizeObserver2.observe(canvas2Ref.value!.parentElement!)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  resizeObserver?.disconnect()
  resizeObserver2?.disconnect()
})
</script>

<template>
  <div class="page-container">
    <!-- 第一个图谱：Vibe Coding 优化 -->
    <div class="graph-section">
      <div class="page-header">
        <h1 class="page-title">Graph</h1>
        <p class="page-subtitle">Vibe Coding 优化</p>
      </div>

      <!-- 标签栏 -->
      <div class="tags-bar">
        <button
          v-for="theme in themes"
          :key="theme.id"
          class="tag-btn"
          :class="{ active: activeTheme === theme.id }"
          :style="activeTheme === theme.id ? { borderColor: theme.color, color: theme.color } : {}"
          @click="selectTheme(theme.id)"
        >
          <span class="tag-dot" :style="{ background: theme.color }"></span>
          {{ theme.label }}
        </button>
      </div>

      <!-- 状态提示 -->
      <div class="status-hint">
        当前主题：{{ themes.find(t => t.id === activeTheme)?.label }}，共 {{ Math.max(0, nodes.length - 1) }} 个子问题
      </div>

      <!-- 图谱画布 -->
      <div class="graph-wrap">
        <canvas
          ref="canvasRef"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
        />
      </div>
    </div>

    <!-- 第二个图谱：AI Agent 关键词 -->
    <div class="graph-section">
      <div class="page-header">
        <h1 class="page-title">Graph</h1>
        <p class="page-subtitle">Agent</p>
      </div>

      <!-- 分类标签栏（点击高亮，不筛选） -->
      <div class="tags-bar">
        <button
          v-for="cat in agentCategories"
          :key="cat.id"
          class="tag-btn"
          :class="{ active: highlightedCategory === cat.id }"
          :style="highlightedCategory === cat.id ? { borderColor: cat.color, color: cat.color } : {}"
          @click="selectCategory(cat.id)"
        >
          <span class="tag-dot" :style="{ background: cat.color }"></span>
          {{ cat.label }}
        </button>
      </div>

      <!-- 图谱画布 -->
      <div class="graph-wrap">
        <canvas
          ref="canvas2Ref"
          @mousedown="onMouseDown2"
          @mousemove="onMouseMove2"
          @mouseup="onMouseUp2"
          @mouseleave="onMouseLeave2"
          style="cursor: grab;"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.graph-section {
  margin-bottom: 60px;
}

.page-header {
  margin-bottom: 20px;
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

/* 标签栏 */
.tags-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.tag-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.tag-btn.active {
  background: #f0fdf4;
  font-weight: 500;
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.clear-btn {
  padding: 6px 12px;
  border: 1px solid #fecaca;
  border-radius: 6px;
  background: white;
  color: #ef4444;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: auto;
}

.clear-btn:hover {
  background: #fef2f2;
}

/* 状态提示 */
.status-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
  text-align: center;
}

/* 图例 */
.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #6b7280;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-label {
  font-weight: 500;
}

/* 画布容器 */
.graph-wrap {
  width: 100%;
  height: 600px;
  border: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
}

canvas {
  display: block;
}
</style>
