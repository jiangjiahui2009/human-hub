-- ============================================================
-- Skill Hub · 添加 tags 字段到 skills 表
-- 在 Supabase 控制台 → SQL Editor 执行
-- ============================================================

-- 1. 添加 tags 字段（如果不存在）
alter table public.skills 
add column if not exists tags text[] default '{}';

-- 2. 添加 GIN 索引用于快速筛选
-- 先删除可能存在的旧索引
DROP INDEX IF EXISTS skills_tags_idx;
-- 创建新索引
create index skills_tags_idx on public.skills using gin(tags);

-- 3. 验证字段添加成功
select column_name, data_type, column_default 
from information_schema.columns 
where table_name = 'skills' and table_schema = 'public';

-- 4. 查看现有数据
select id, name, tags from skills order by created_at desc limit 20;
