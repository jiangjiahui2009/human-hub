-- ============================================================
-- Skill Hub · 为现有数据添加标签
-- 在 Supabase 控制台 → SQL Editor 执行
-- ============================================================

-- 先查看现有数据
select id, name, tags from skills order by created_at desc limit 20;

-- 为现有 skills 添加标签（根据 skill 名称智能匹配）
-- 注意：这里假设你的现有数据有 id 和 name，需要根据实际情况调整

-- 示例：给特定 skill 添加标签
-- update skills set tags = array['generate_ideas'] where name like '%点子%';
-- update skills set tags = array['optimize_expression'] where name like '%Prompt%' or name like '%表达%';
-- update skills set tags = array['reduce_rework'] where name like '%返工%' or name like '%需求%';
-- update skills set tags = array['unlock_agent'] where name like '%Agent%' or name like '%能力%';
-- update skills set tags = array['token_usage'] where name like '%Token%' or name like '%消耗%';
-- update skills set tags = array['multi_agent'] where name like '%多Agent%' or name like '%协作%';
-- update skills set tags = array['production'] where name like '%生产%' or name like '%稳定%';
-- update skills set tags = array['bug_fix'] where name like '%Bug%' or name like '%修复%';

-- 添加 tags 字段的 GIN 索引（用于快速筛选）
create index if not exists skills_tags_idx on public.skills using gin(tags);

-- 验证更新结果
select id, name, tags from skills where array_length(tags, 1) > 0 limit 10;
