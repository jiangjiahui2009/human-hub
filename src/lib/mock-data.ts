/**
 * Mock 数据层 — 用于前端原型预览，不依赖 Supabase
 * 所有数据存储在内存 + localStorage，刷新页面不丢失
 */
import type { Skill, Comment } from '../types'

// ===== 模拟用户（当前登录用户）=====
export const MOCK_CURRENT_USER = {
  id: 'mock-user-001',
  email: 'dev@example.com',
  user_metadata: {
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    full_name: '开发者小明',
    preferred_username: 'xiaoming-dev',
  },
}

// ===== 其他模拟发布者 =====
export const MOCK_AUTHORS = [
  { id: 'author-001', name: '张三', avatar: 'https://avatars.githubusercontent.com/u/2?v=4' },
  { id: 'author-002', name: 'AI研究员李四', avatar: 'https://avatars.githubusercontent.com/u/3?v=4' },
  { id: 'author-003', name: '全栈工程师王五', avatar: 'https://avatars.githubusercontent.com/u/4?v=4' },
  { id: 'author-004', name: '数据科学家赵六', avatar: 'https://avatars.githubusercontent.com/u/5?v=4' },
  { id: 'author-005', name: '产品经理孙七', avatar: 'https://avatars.githubusercontent.com/u/6?v=4' },
]

// ===== Mock 技能数据 =====
export const MOCK_SKILLS_INIT: Skill[] = [
  {
    id: 'skill-001',
    name: '网页智能摘要提取',
    version: '2.1.0',
    summary: '自动分析任意网页内容，提取关键信息生成结构化摘要。支持中英文双语识别，可自定义摘要长度、侧重点和输出格式，适配新闻、论文、博客等多种内容场景，大幅提升信息获取效率。',
    description: `## 使用说明

### 基本用法
\`\`\`typescript
import { WebSummarizer } from '@ai/skills'

const summarizer = new WebSummarizer({
  language: 'zh',
  maxLength: 500,
})

const result = await summarizer.summarize('https://example.com/article')
console.log(result.summary)
console.log(result.keyPoints) // 关键要点数组
\`\`\`

### 配置选项
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| \`language\` | string | 'auto' | 摘要语言：'zh', 'en', 'auto' |
| \`maxLength\` | number | 300 | 最大字符数 |
| \`extractKeywords\` | boolean | true | 是否提取关键词 |
| \`includeMetadata\` | boolean | false | 是否包含页面元信息 |

### 高级功能
- **多层级摘要**：同时生成一句话概述、段落摘要、详细版
- **关键点提取**：自动列出文章的 3-5 个核心观点
- **引用溯源**：每个关键点标注原文位置

### 注意事项
- 需要目标网站允许抓取（非 JS 渲染页面效果最佳）
- 超过 10 万字的长文建议分段处理
`,
    caseExample: `## 案例：新闻资讯快速消化

### 场景
每天需要阅读大量科技新闻，希望快速了解每篇文章的核心内容。

### 操作步骤
\`\`\`bash
# 1. 安装
npm install @ai/web-summarizer

# 2. 创建配置文件 summarizer.config.json
{
  "language": "zh",
  "maxLength": 200,
  "format": "bullet-points"
}

# 3. 批量处理 URL 列表
cat urls.txt | npx summarizer batch > output.md
\`\`\`

### 输出示例
> **标题**: GPT-5 发布，性能提升 10 倍
> 
> **核心要点**:
> - 新架构支持 1M token 上下文窗口
> - 推理速度提升 3x，成本降低 50%
> - 已开放 API 公测

### 效果
处理 50 篇文章从原来的 3 小时缩短到 15 分钟。
`,
    authorId: 'author-001',
    authorName: '张三',
    authorAvatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    starsCount: 128,
    commentsCount: 23,
    createdAt: '2026-03-28T08:30:00Z',
    updatedAt: '2026-04-01T14:20:00Z',
  },
  {
    id: 'skill-002',
    name: 'GitHub 代码审查助手',
    version: '1.5.0',
    summary: '基于 AI 的 PR 自动审查工具，深度检测代码质量、安全漏洞与性能瓶颈。支持多语言项目，集成 GitHub Actions 后可自动评论审查结果，帮助团队在合并前发现潜在问题，显著提升代码质量。',
    description: `## 使用说明

### 快速开始
\`\`\`python
from ai_skills import CodeReviewer

reviewer = CodeReviewer(model='gpt-4')
report = reviewer.review_pr(
    repo_owner='myorg',
    repo_name='myrepo',
    pr_number=42,
)
\`\`\`

### 审查维度
1. **代码质量**：命名规范、复杂度、重复代码
2. **安全性**：SQL注入、XSS、敏感信息泄露
3. **性能**：N+1查询、内存泄漏风险
4. **最佳实践**：框架特定规范、设计模式建议
`,
    caseExample: `## 案例：团队 PR 审查效率提升

### 背景
5 人团队日均 15 个 PR，人工 review 瓶颈严重。

### 接入方式
在 GitHub Actions 中添加：
\`\`\`yaml
- uses: ai-skills/code-reviewer@v1
  with:
    github_token: \${{ secrets.GITHUB_TOKEN }}
    severity_threshold: 'warning'
    auto_comment: true
\`\`\`

### 结果
- PR 平均审查时间从 2h → 20min
- 线上 bug 减少 40%
- 团队代码风格统一度显著提升
`,
    authorId: 'author-002',
    authorName: 'AI研究员李四',
    authorAvatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    starsCount: 256,
    commentsCount: 45,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-30T16:45:00Z',
  },
  {
    id: 'skill-003',
    name: '自然语言转 SQL 查询',
    version: '1.0.0',
    summary: '用自然语言描述数据需求，自动生成精确的 SQL 查询语句。支持 MySQL、PostgreSQL、SQLite 等主流数据库，可导入表结构提升准确率，特别适合不懂 SQL 的运营和产品人员自助取数。',
    description: `## 使用说明

### 基础用法
\`\`\`javascript
const { NLToSQL } = require('@ai/nl-to-sql')

const converter = new NLToSQL({
  dialect: 'postgresql',
  schema: './schema.sql', // 可选：提供表结构以提升准确率
})

const sql = await converter.convert(
  "查询上个月销售额排名前10的产品，包含产品名和总金额"
)
// → SELECT product_name, SUM(amount) FROM orders ...
\`\`\`

### 支持的操作
- SELECT 查询（单表/多表 JOIN）
- 聚合函数（COUNT, SUM, AVG, MAX, MIN）
- GROUP BY + HAVING
- ORDER BY + LIMIT
- 子查询
`,
    caseExample: `## 案例：运营人员自助取数

### 场景
运营团队不懂 SQL，但经常需要从数据库拉取数据做分析。

### 实际对话示例
**用户输入**: "上个月新注册用户按城市分布"
**系统输出**:
\`\`\`sql
SELECT city, COUNT(*) as user_count
FROM users
WHERE created_at >= '2026-03-01' AND created_at < '2026-04-01'
GROUP BY city
ORDER BY user_count DESC
\`\`\`

### 准确率
在常见业务场景下达到 **92%+** 的一次生成准确率。
`,
    authorId: 'author-003',
    authorName: '全栈工程师王五',
    authorAvatar: 'https://avatars.githubusercontent.com/u/4?v=4',
    starsCount: 89,
    commentsCount: 12,
    createdAt: '2026-03-25T15:00:00Z',
    updatedAt: '2026-03-25T15:00:00Z',
  },
  {
    id: 'skill-004',
    name: 'Markdown 文档翻译器',
    version: '1.2.0',
    summary: '完整保持 Markdown 格式的智能文档翻译器，支持 30+ 语言互译。代码块和公式自动跳过翻译，自定义术语表确保专业词汇一致，支持增量翻译，大幅降低多语言文档维护成本。',
    description: `## 使用说明

### CLI 使用
\`\`\`bash
npx md-translator translate ./docs/en ./docs/zh --from en --to zh --glossary terms.csv
\`\`\`

### API 调用
\`\`\`typescript
import { MDTranslator } from '@ai/md-translator'

const t = new MDTranslator({
  srcLang: 'en',
  tgtLang: 'zh',
  preserveCode: true,       // 代码块不翻译
  preserveFormula: true,    // LaTeX 公式不翻译
})

const result = await t.translate('# Hello World')
// → # 你好世界
\`\`\`

### 特性
- 保持所有 Markdown 语法不变（表格、链接、图片、代码块）
- 支持自定义术语表，保证专业词汇一致
- 支持增量翻译（只翻译新增/修改的部分）
`,
    caseExample: `## 案例：开源项目国际化

### 任务
将一个 200+ 页的英文技术文档翻译成中文。

### 流程
\`\`\`
1. 准备术语表（专业名词统一翻译）
2. 全量首次翻译（~30分钟）
3. 人工校对（重点检查格式）
4. 后续增量翻译（每次更新只需翻译改动部分）
\`\`\`

### 成果
- 翻译一致性评分：9.2/10
- 格式保持率：99.8%
- 后续维护成本降低 70%
`,
    authorId: 'author-001',
    authorName: '张三',
    authorAvatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    starsCount: 67,
    commentsCount: 8,
    createdAt: '2026-03-22T09:00:00Z',
    updatedAt: '2026-04-02T11:30:00Z',
  },
  {
    id: 'skill-005',
    name: 'API 文档自动生成器',
    version: '2.0.0',
    summary: '从代码注释或 OpenAPI 规范自动生成交互式 API 文档。内置 Swagger UI 支持在线调试，一键启动 Mock Server 实现前后端并行开发，自动追踪 API 版本变更，导出 HTML/PDF 等多种格式。',
    description: `## 使用说明

### 从代码注释生成
\`\`\`bash
# Python FastAPI / Flask
npx api-docs-gen parse ./src --output ./docs --framework fastapi

# TypeScript / Node.js (Express/Koa)
npx api-docs-gen parse ./src --output ./docs --framework express
\`\`\`

### 功能特性
- **交互式文档**：内置 Swagger UI，可直接在线测试 API
- **Mock Server**：一键启动 Mock 服务器，前后端并行开发
- **变更追踪**：自动记录 API 版本变更 diff
- **多格式导出**：HTML / PDF / OpenAPI JSON
`,
    caseExample: `## 案例：RESTful API 项目文档自动化

### 背景
后端团队手动维护 API 文档，经常与实际代码不一致。

### 解决方案
在 CI/CD 中加入文档生成步骤：
\`\`\`yaml
# .github/workflows/docs.yml
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx api-docs-gen build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          publish_dir: ./docs
\`\`\`

### 效果
文档与代码始终保持同步，零维护成本。
`,
    authorId: 'author-003',
    authorName: '全栈工程师王五',
    authorAvatar: 'https://avatars.githubusercontent.com/u/4?v=4',
    starsCount: 194,
    commentsCount: 31,
    createdAt: '2026-03-18T12:00:00Z',
    updatedAt: '2026-03-28T09:15:00Z',
  },
  {
    id: 'skill-006',
    name: '数据分析报告生成器',
    version: '1.1.0',
    summary: '上传 CSV 或 Excel 数据文件后，自动完成数据概览、描述性统计、分布分析和相关性检测。内置多种可视化图表，自动标注异常值，几分钟内输出专业级分析报告，让数据分析零门槛。',
    description: `## 使用说明

### Python SDK
\`\`\`python
from ai_skills import DataReport

report = DataReport()
result = report.analyze('sales_data.csv', {
    target_column='revenue',
    include_visualizations=True,
    lang='zh',
})
report.save('analysis_report.html')
\`\`\`

### 分析内容
1. **数据概览**：行数、列数、缺失值统计、类型分布
2. **描述性统计**：均值、中位数、标准差、分位数
3. **分布分析**：直方图、箱线图、核密度图
4. **相关性分析**：热力图、散点图矩阵
5. **异常值检测**：IQR 方法自动标记异常点
`,
    caseExample: `## 案例：电商销售数据快速洞察

### 输入
上传 10 万条订单 CSV 数据。

### 自动输出报告包含：
- 月度销售趋势折线图
- TOP10 热销商品柱状图
- 用户复购率漏斗图
- 地域销售热力地图
- 异常订单预警列表

### 节省时间
原本需要 Excel + Tableau 花费半天的工作，现在 **3 分钟**出报告。
`,
    authorId: 'author-004',
    authorName: '数据科学家赵六',
    authorAvatar: 'https://avatars.githubusercontent.com/u/5?v=4',
    starsCount: 145,
    commentsCount: 19,
    createdAt: '2026-03-15T14:00:00Z',
    updatedAt: '2026-03-27T10:00:00Z',
  },
  {
    id: 'skill-007',
    name: '智能邮件分类路由',
    version: '1.0.0',
    summary: '智能识别邮件意图并自动分类到对应处理队列。结合关键词规则与机器学习模型混合策略，支持工单、销售、财务等多类别路由，大幅缩短邮件响应时间，紧急问题零漏检。',
    description: `## 使用说明

### 配置文件 mail-router.yaml
\`\`\`yaml
rules:
  - name: "工单类"
    patterns: ["bug", "error", "无法", "问题"]
    action: route_to_ticket_system
    
  - name: "销售线索"  
    patterns: ["报价", "价格", "采购"]
    action: route_to_sales

ml_model:
  enabled: true
  confidence_threshold: 0.85
  fallback: human_review
\`\`\`

### 分类类别（默认支持）
- 工单/技术支持
- 销售询价
- 财务/发票
- HR/人事
- 合作/商务
- 其他/人工审核
`,
    caseExample: `## 案例：客服团队邮件分流

### 背景
客服邮箱日收 500+ 封邮件，人工分拣耗时且容易遗漏紧急问题。

### 部署效果
| 指标 | 部署前 | 部署后 |
|------|--------|--------|
| 平均响应时间 | 4h | 45min |
| 分类准确率 | — | 94% |
| 紧急邮件漏检率 | 15% | 0.5% |

### 特别亮点
结合 ML 模型后，对模糊邮件的分类准确率提升了 **23%**。
`,
    authorId: 'author-005',
    authorName: '产品经理孙七',
    authorAvatar: 'https://avatars.githubusercontent.com/u/6?v=4',
    starsCount: 52,
    commentsCount: 7,
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-01T08:00:00Z',
  },
  {
    id: 'skill-008',
    name: 'Git 提交信息规范化',
    version: '1.3.0',
    summary: '基于 Conventional Commits 规范自动生成和校验 Git commit message。支持中英文、团队定制模板和 pre-commit hook 强制校验，让团队代码提交风格统一，自动生成 changelog 不再是奢望。',
    description: `## 使用说明

### 安装 & 配置
\`\`\`bash
npm install -g @ai/commit-helper

# 在项目根目录初始化
cd my-project
commit-helper init
\`\`\`

### 生成的 Commit Message 格式
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### 支持的 Type
- feat: 新功能
- fix: Bug 修复
- docs: 文档变更
- style: 代码格式调整（不影响逻辑）
- refactor: 重构（既不是新功能也不是修复）
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具链变更
`,
    caseExample: `## 案例：团队协作规范落地

### 问题
团队成员 commit message 风格五花八门：
- \`fixed bug\`
- \`update\`
- \`修改了xxx\`
- \`asdfghjkl\`

### 解决方案
\`\`\`bash
# 1. 初始化
commit-helper init --template conventional-zh

# 2. 加入 pre-commit hook（强制校验）
commit-hook install --enforce

# 3. 之后每次 git commit 会弹出交互式引导
\`\`\`

### 结果
团队 commit message 规范率从 **30% → 99%**，changelog 自动生成成为可能。
`,
    authorId: 'author-002',
    authorName: 'AI研究员李四',
    authorAvatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    starsCount: 310,
    commentsCount: 56,
    createdAt: '2026-03-10T06:00:00Z',
    updatedAt: '2026-04-03T17:00:00Z',
  },
  {
    id: 'skill-009',
    name: '图片 OCR + 结构化提取',
    version: '1.0.0',
    summary: '从图片、截图或 PDF 中精准识别文字内容，并按预设模板结构化输出为 JSON 或表格。内置发票、收据、名片等多种模板，数字字段准确率达 98%，批量处理让票据录入效率提升数十倍。',
    description: `## 使用说明

\`\`\`javascript
import { OCRExtractor } from '@ai/ocr-extractor'

const extractor = new OCRExtractor()

// 通用 OCR
const text = await extractor.extractText('invoice.png')

// 结构化提取（需指定模板）
const data = await extractor.extractStructured('receipt.jpg', {
  template: 'restaurant-receipt',
  output: 'json',
})
// → { merchant: 'xxx', date: '...', items: [...], total: 123.45 }
\`\`\`

### 内置模板
- 发票（增值税/普通发票）
- 收据（餐饮/超市/打车）
- 名片
- 身份证/护照
- 表格图片 → CSV
`,
    caseExample: `## 案例：财务报销自动录入

### 痛点
每月 200+ 张发票/收据需要手工录入财务系统，容易出错。

### 方案
\`\`\`python
# 批量处理文件夹内所有票据
import ocr_extractor as ocr

results = []
for img in glob('./invoices/*.jpg'):
    data = ocr.extract(img, template='invoice')
    results.append(data)

# 导出为 Excel
pd.DataFrame(results).to_excel('报销汇总.xlsx')
\`\`\`

### 准确率
- 数字字段：98.5%
- 中文文本：96%
- 表格还原：93%
`,
    authorId: 'author-004',
    authorName: '数据科学家赵六',
    authorAvatar: 'https://avatars.githubusercontent.com/u/5?v=4',
    starsCount: 78,
    commentsCount: 14,
    createdAt: '2026-03-28T11:00:00Z',
    updatedAt: '2026-03-28T11:00:00Z',
  },
  {
    id: 'skill-010',
    name: '会议纪要自动整理',
    version: '1.1.0',
    summary: '将会议录音或视频自动转为文字，智能提炼议程概览、核心决策、待办任务与责任人。支持 Markdown/JSON/Notion 等输出格式，关键信息召回率达 95%，从此告别手动整理会议纪要。',
    description: `## 使用说明

\`\`\`typescript
import { MeetingNotes } from '@ai/meeting-notes'

const mn = new MeetingNotes({ language: 'zh-CN' })

const notes = await mn.process({
  audioFile: './meeting.mp3',  // 或传入转录后的文字
  attendees: ['张三', '李四', '王五'],
  format: 'markdown',         // markdown | json | notion
})
\`\`\`

### 输出内容
1. **基本信息**：时间、参会人、会议时长
2. **议程概览**：讨论了哪些话题及各自时长占比
3. **决策记录**：每项决策的内容和结论
4. **待办任务**：任务描述 + 责任人 + 截止日期
5. **关键词索引**：方便后续检索
`,
    caseExample: `## 案例：周会效率翻倍

### 之前
每周一 2 小时例会，会后靠回忆补纪要，经常遗漏 action item。

### 之后
\`\`\`bash
# 会议结束后一键执行
npx meeting-notes process recording.webm \
  --attendees 张三,李四,王五,赵六 \
  --output meeting-notes.md
\`\`\`

### 输出质量
- 决策项召回率：95%
- Action Item 提取准确率：91%
- 团队反馈：再也没漏过待办
`,
    authorId: 'author-005',
    authorName: '产品经理孙七',
    authorAvatar: 'https://avatars.githubusercontent.com/u/6?v=4',
    starsCount: 163,
    commentsCount: 27,
    createdAt: '2026-03-22T16:00:00Z',
    updatedAt: '2026-04-02T13:00:00Z',
  },
]

// ===== Mock 评论数据 =====
export const MOCK_COMMENTS_INIT: Comment[] = [
  // skill-001 的评论
  { id: 'cmt-001', skillId: 'skill-001', userId: 'author-002', userName: 'AI研究员李四', userAvatar: 'https://avatars.githubusercontent.com/u/3?v=4', content: '非常实用的技能！已经集成到我们的日报流程里了，每天节省大量阅读时间。有个小建议：能不能支持 PDF 文件直接解析？', createdAt: '2026-03-29T09:15:00Z' },
  { id: 'cmt-002', skillId: 'skill-001', userId: 'author-003', userName: '全栈工程师王五', userAvatar: 'https://avatars.githubusercontent.com/u/4?v=4', content: '试了一下，对中文网页的支持确实不错。不过长文的摘要有时候会丢失一些细节，希望能增加一个「详细模式」开关。', createdAt: '2026-03-30T14:20:00Z' },
  { id: 'cmt-003', skillId: 'skill-001', userId: 'mock-user-001', userName: '开发者小明', userAvatar: 'https://avatars.githubusercontent.com/u/1?v=4', content: '感谢分享！请问有 Docker 一键部署的方式吗？', createdAt: '2026-04-01T10:00:00Z' },

  // skill-002 的评论
  { id: 'cmt-004', skillId: 'skill-002', userId: 'author-001', userName: '张三', userAvatar: 'https://avatars.githubusercontent.com/u/2?v=4', content: '我们团队用了两周了，code review 质量明显提升。特别是安全漏洞检测这块，帮我们拦住了两个潜在的 SQL 注入问题。👍', createdAt: '2026-03-22T11:30:00Z' },
  { id: 'cmt-005', skillId: 'skill-002', userId: 'author-004', userName: '数据科学家赵六', userAvatar: 'https://avatars.githubusercontent.com/u/5?v=4', content: '想问下对于 Python 项目的支持情况如何？我们的后端主要是 Python/Django。', createdAt: '2026-03-25T16:45:00Z' },
  { id: 'cmt-006', skillId: 'skill-002', userId: 'author-003', userName: '全栈工程师王五', userAvatar: 'https://avatars.githubusercontent.com/u/4?v=4', content: '@赵六 Python 支持很好，我们就是 Django 项目接入的，基本开箱即用。建议配合 ruff/flake8 一起使用效果更好。', createdAt: '2026-03-26T09:00:00Z' },

  // skill-008 的评论
  { id: 'cmt-007', skillId: 'skill-008', userId: 'author-001', userName: '张三', userAvatar: 'https://avatars.githubusercontent.com/u/2?v=4', content: '这个太棒了！终于可以让团队统一 commit 风格了。已 star ⭐', createdAt: '2026-03-12T08:00:00Z' },
  { id: 'cmt-008', skillId: 'skill-008', userId: 'author-005', userName: '产品经理孙七', userAvatar: 'https://avatars.githubusercontent.com/u/6?v=4', content: '请问支持 gitlab CI 吗？我们公司用的是 GitLab 不是 GitHub', createdAt: '2026-03-15T14:30:00Z' },
  { id: 'cmt-009', skillId: 'skill-008', userId: 'author-002', userName: 'AI研究员李四', userAvatar: 'https://avatars.githubusercontent.com/u/3?v=4', content: '@孙七 支持的！pre-commit hook 是通用的，不依赖具体 Git 平台。CI 集成那块可以自己写个简单的 gitlab-ci job 调用即可。', createdAt: '2026-03-15T16:00:00Z' },

  // skill-005 的评论
  { id: 'cmt-010', skillId: 'skill-005', userId: 'author-004', userName: '数据科学家赵六', userAvatar: 'https://avatars.githubusercontent.com/u/5?v=4', content: 'Mock Server 功能太好用了！前端再也不用等后端接口了。', createdAt: '2026-03-19T10:00:00Z' },
  { id: 'cmt-011', skillId: 'skill-005', userId: 'author-001', userName: '张三', userAvatar: 'https://avatars.githubusercontent.com/u/2?v=4', content: '+1 Mock Server 确实香。顺便提个小 bug：当接口返回空数组时文档显示有点问题。', createdAt: '2026-03-20T09:30:00Z' },

  // skill-010 的评论
  { id: 'cmt-012', skillId: 'skill-010', userId: 'author-002', userName: 'AI研究员李四', userAvatar: 'https://avatars.githubusercontent.com/u/3?v=4', content: '这个对我们这种天天开会的人来说简直是救星 😂', createdAt: '2026-03-23T11:00:00Z' },
  { id: 'cmt-013', skillId: 'skill-010', userId: 'author-003', userName: '全栈工程师王五', userAvatar: 'https://avatars.githubusercontent.com/u/4?v=4', content: '已推荐给我们项目经理了，她很喜欢自动提取 Action Item 这个功能。', createdAt: '2026-03-24T15:00:00Z' },
]

// ===== localStorage 持久化键名 =====
const SKILLS_KEY = 'skillhub_mock_skills'
const STARS_KEY = 'skillhub_mock_stars'
const COMMENTS_KEY = 'skillhub_mock_comments'

// ===== 模拟当前用户的 Star 记录（默认 star 了一些）=====
const DEFAULT_MY_STARS = new Set(['skill-001', 'skill-008', 'skill-010'])

// ===== 持久化工具 =====
function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToLS(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/** 初始化/加载技能列表 */
export function loadMockSkills(): Skill[] {
  return loadFromLS<Skill[]>(SKILLS_KEY, MOCK_SKILLS_INIT)
}

/** 保存技能列表 */
export function saveMockSkills(skills: Skill[]): void {
  saveToLS(SKILLS_KEY, skills)
}

/** 加载评论 */
export function loadMockComments(): Comment[] {
  return loadFromLS<Comment[]>(COMMENTS_KEY, MOCK_COMMENTS_INIT)
}

/** 保存评论 */
export function saveMockComments(comments: Comment[]): void {
  saveToLS(COMMENTS_KEY, comments)
}

/** 加载我的 Star */
export function loadMyStars(): Set<string> {
  try {
    const raw = localStorage.getItem(STARS_KEY)
    return raw ? new Set(JSON.parse(raw)) : DEFAULT_MY_STARS
  } catch {
    return DEFAULT_MY_STARS
  }
}

/** 保存我的 Star */
export function saveMyStars(ids: Set<string>): void {
  saveToLS(STARS_KEY, [...ids])
}
