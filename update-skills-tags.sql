-- ============================================================
-- Skill Hub · 为现有 skills 添加标签
-- 在 Supabase 控制台 → SQL Editor 执行
-- ============================================================

-- 根据 skill 名称智能匹配标签

-- AI 写作助手 → generate_ideas (产生点子)
update skills set tags = array['generate_ideas'] 
where id = '61c3e001-a4ab-4a18-aeb6-536f974dae21';

-- 代码审查 Bot → bug_fix (bug修复)
update skills set tags = array['bug_fix'] 
where id = '37a9d9e1-3e08-4911-973c-9a2d0b2e5c7b';

-- 数据可视化引擎 → production (生产环境)
update skills set tags = array['production'] 
where id = 'd7c91306-49ae-431a-a7be-7aa2f5bb4933';

-- Prompt 工程模板库 → optimize_expression (优化表达)
update skills set tags = array['optimize_expression'] 
where id = 'cbbfffb3-8345-4335-9d65-58b44b196b94';

-- API Mock 服务器 → production (生产环境)
update skills set tags = array['production'] 
where id = '67c9c4e5-bc1c-4410-aa67-8344ff1f025d';

-- 验证更新结果
select id, name, tags from skills order by created_at desc limit 10;
